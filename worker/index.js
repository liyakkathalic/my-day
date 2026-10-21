// Cloudflare Worker for My Day: /api/* is the sync API on D1, /quote.json is
// today's quote (fetched from the GitHub Pages site), everything else is the
// static app in dist-cloud/. Same API as the self-hosted server (server/index.js).
import { COLLECTIONS, MAX_RECORD_BYTES } from './limits.js';

const COOKIE = 'md_session';
const SESSION_DAYS = 180;
const PBKDF2_ITERATIONS = 100_000; // the most Workers allows
const QUOTE_URL = 'https://liyakkathalic.github.io/my-day/quote.json';

const enc = new TextEncoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const sha256 = async (t) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(t)))].map((x) => x.toString(16).padStart(2, '0')).join('');

async function pbkdf2(pw, salt) {
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS }, key, 256));
}
async function hashPassword(pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${PBKDF2_ITERATIONS}$${b64(salt)}$${b64(await pbkdf2(pw, salt))}`;
}
function sameBytes(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}

const json = (status, body, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
});

const getMeta = async (env, k) => (await env.DB.prepare('SELECT v FROM meta WHERE k = ?').bind(k).first())?.v ?? null;
const setMeta = (env, k, v) => env.DB.prepare('INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v').bind(k, String(v)).run();

const rowOut = (r) => r && {
  col: r.col, id: r.id, rev: r.rev, seq: r.seq, deleted: !!r.deleted,
  data: r.data ? JSON.parse(r.data) : null, updatedAt: r.updated_at,
};

function cookieToken(request) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}
const sessionCookie = (token, maxAge) => `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;

async function isAuthed(env, request) {
  const token = cookieToken(request);
  if (!token) return false;
  const row = await env.DB.prepare('SELECT expires FROM sessions WHERE token_hash = ?').bind(await sha256(token)).first();
  return !!row && row.expires > Date.now();
}

async function newSession(env) {
  const token = b64(crypto.getRandomValues(new Uint8Array(32))).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' }[c]));
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO sessions (token_hash, created, expires) VALUES (?, ?, ?)').bind(await sha256(token), now, now + SESSION_DAYS * 86400_000),
    env.DB.prepare('DELETE FROM sessions WHERE expires < ?').bind(now),
  ]);
  return sessionCookie(token, SESSION_DAYS * 86400);
}

// Lockout: 5 failures from one address in 15 minutes, or 30 in an hour overall.
async function lockedOut(env, ipHash) {
  const now = Date.now();
  const mine = await env.DB.prepare('SELECT COUNT(*) AS n FROM login_fails WHERE ip_hash = ? AND at > ?').bind(ipHash, now - 15 * 60_000).first();
  const all = await env.DB.prepare('SELECT COUNT(*) AS n FROM login_fails WHERE at > ?').bind(now - 3600_000).first();
  return mine.n >= 5 || all.n >= 30;
}
const recordFail = (env, ipHash) => env.DB.batch([
  env.DB.prepare('INSERT INTO login_fails (ip_hash, at) VALUES (?, ?)').bind(ipHash, Date.now()),
  env.DB.prepare('DELETE FROM login_fails WHERE at < ?').bind(Date.now() - 86400_000),
]);

async function verifyPassword(env, pw) {
  const stored = await getMeta(env, 'password');
  if (!stored || typeof pw !== 'string' || pw.length > 500) { await pbkdf2('dummy', new Uint8Array(16)); return false; }
  const [, iter, salt, hash] = stored.split('$');
  if (Number(iter) !== PBKDF2_ITERATIONS) return false;
  return sameBytes(await pbkdf2(pw, unb64(salt)), unb64(hash));
}

function validateChange(c) {
  if (!c || typeof c !== 'object') return 'Invalid change';
  if (!COLLECTIONS.has(c.col)) return 'Unknown collection';
  if (typeof c.id !== 'string' || !c.id || c.id.length > 200) return 'Invalid id';
  if (!Number.isInteger(c.baseRev) || c.baseRev < 0) return 'Invalid baseRev';
  if (!c.deleted && (typeof c.data !== 'object' || c.data === null || Array.isArray(c.data))) return 'Invalid data';
  if (c.data && JSON.stringify(c.data).length > MAX_RECORD_BYTES) return 'Record too large';
  return null;
}

// Each change is one D1 batch (a transaction): take the next sequence number,
// then write only if the stored revision is still the one the device based its
// change on. Otherwise nothing is written and the server copy comes back.
async function applyChange(env, c) {
  const err = validateChange(c);
  if (err) return { col: c?.col, id: c?.id, ok: false, error: err };
  const now = Date.now();
  const data = c.deleted ? null : JSON.stringify(c.data);
  const [, write] = await env.DB.batch([
    env.DB.prepare("UPDATE meta SET v = CAST(v AS INTEGER) + 1 WHERE k = 'seq'"),
    c.baseRev === 0
      ? env.DB.prepare(`INSERT INTO records (col, id, rev, seq, deleted, data, updated_at)
          SELECT ?, ?, 1, CAST(v AS INTEGER), ?, ?, ? FROM meta WHERE k = 'seq'
          ON CONFLICT(col, id) DO NOTHING`).bind(c.col, c.id, c.deleted ? 1 : 0, data, now)
      : env.DB.prepare(`UPDATE records SET rev = rev + 1, seq = (SELECT CAST(v AS INTEGER) FROM meta WHERE k = 'seq'),
          deleted = ?, data = ?, updated_at = ? WHERE col = ? AND id = ? AND rev = ?`)
        .bind(c.deleted ? 1 : 0, data, now, c.col, c.id, c.baseRev),
  ]);
  if (write.meta.changes === 1) {
    const r = await env.DB.prepare('SELECT rev, seq FROM records WHERE col = ? AND id = ?').bind(c.col, c.id).first();
    return { col: c.col, id: c.id, ok: true, rev: r.rev, seq: r.seq };
  }
  const row = await env.DB.prepare('SELECT * FROM records WHERE col = ? AND id = ?').bind(c.col, c.id).first();
  return { col: c.col, id: c.id, ok: false, conflict: true, server: rowOut(row) };
}

async function changesSince(env, since, limit = 2000) {
  const { results } = await env.DB.prepare('SELECT * FROM records WHERE seq > ? ORDER BY seq LIMIT ?').bind(since, limit).all();
  const top = Number(await getMeta(env, 'seq') || 0);
  return {
    records: results.map(rowOut),
    seq: results.length ? results[results.length - 1].seq : Math.max(since, top),
    more: results.length === limit,
  };
}

async function readJson(request, limit) {
  const text = await request.text();
  if (text.length > limit) throw Object.assign(new Error('Too large'), { status: 413 });
  try { return text ? JSON.parse(text) : {}; } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }); }
}

async function api(request, env, url) {
  const p = url.pathname;
  const m = request.method;
  if (m === 'POST' && request.headers.get('X-MyDay') !== '1') return json(403, { error: 'Missing request header' }); // CSRF guard

  if (p === '/api/health') return json(200, { ok: true });
  if (p === '/api/session' && m === 'GET') {
    return json(200, { signedIn: await isAuthed(env, request), passwordSet: !!(await getMeta(env, 'password')) });
  }
  const ipHash = await sha256('ip:' + (request.headers.get('CF-Connecting-IP') || 'unknown'));
  if (p === '/api/setup' && m === 'POST') {
    // First run only: choose the password, proven with the one-time setup code.
    const body = await readJson(request, 4096);
    if (await getMeta(env, 'password')) return json(409, { error: 'A password is already set. Sign in instead.' });
    if (await lockedOut(env, ipHash)) return json(429, { error: 'Too many attempts. Please wait 15 minutes and try again.' });
    const code = await getMeta(env, 'setup_code');
    if (!code || typeof body.code !== 'string' || (await sha256(body.code.trim().toUpperCase())) !== code) {
      await recordFail(env, ipHash);
      return json(401, { error: 'That setup code is not correct.' });
    }
    if (typeof body.password !== 'string' || body.password.length < 10 || body.password.length > 200) return json(400, { error: 'Choose a password of at least 10 characters.' });
    await setMeta(env, 'password', await hashPassword(body.password));
    await env.DB.prepare("DELETE FROM meta WHERE k = 'setup_code'").run();
    return json(200, { ok: true }, { 'Set-Cookie': await newSession(env) });
  }
  if (p === '/api/login' && m === 'POST') {
    const body = await readJson(request, 4096);
    if (await lockedOut(env, ipHash)) return json(429, { error: 'Too many attempts. Please wait 15 minutes and try again.' });
    if (!(await verifyPassword(env, body.password))) {
      await recordFail(env, ipHash);
      return json(401, { error: 'That password is not correct.' });
    }
    return json(200, { ok: true }, { 'Set-Cookie': await newSession(env) });
  }
  if (p === '/api/logout' && m === 'POST') {
    const token = cookieToken(request);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
    return json(200, { ok: true }, { 'Set-Cookie': sessionCookie('', 0) });
  }

  if (!(await isAuthed(env, request))) return json(401, { error: 'Please sign in' });

  if (p === '/api/sync' && m === 'GET') return json(200, await changesSince(env, Number(url.searchParams.get('since') || 0)));
  if (p === '/api/sync' && m === 'POST') {
    const body = await readJson(request, 8 * 1024 * 1024);
    if (!Array.isArray(body.changes) || body.changes.length > 500) return json(400, { error: 'Invalid changes' });
    const results = [];
    for (const c of body.changes) results.push(await applyChange(env, c));
    return json(200, { results });
  }
  if (p === '/api/export' && m === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM records WHERE deleted = 0 ORDER BY col, id').all();
    return json(200, { app: 'my-day', version: 1, exportedAt: new Date().toISOString(), source: 'server', records: results.map(rowOut) });
  }
  return json(404, { error: 'Not found' });
}

// Today's quote, from the GitHub Pages site (refreshed there every morning), cached for an hour.
async function quote(ctx) {
  const cache = caches.default;
  const key = new Request('https://my-day.internal/quote.json');
  let res = await cache.match(key);
  if (!res) {
    const up = await fetch(QUOTE_URL, { cf: { cacheTtl: 0 } }).catch(() => null);
    if (!up || !up.ok) return json(404, { error: 'No quote today' });
    res = new Response(await up.text(), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' } });
    ctx.waitUntil(cache.put(key, res.clone()));
  }
  return new Response(res.body, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith('/api/')) return await api(request, env, url);
      if (url.pathname === '/quote.json') return await quote(ctx);
    } catch (e) {
      return json(e.status || 500, { error: e.status ? e.message : 'Server error' });
    }
    return env.ASSETS.fetch(request);
  },
};
