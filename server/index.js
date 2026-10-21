import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { login, logout, isAuthed, passwordIsSet } from './auth.js';
import { applyChanges, changesSince, exportAll } from './sync.js';
import { vapid, saveSubscription, removeSubscription, subscriptionStatus, sendToAll } from './push.js';
import { startScheduler, scheduleTest } from './scheduler.js';
import { startBackups } from './backup.js';
import { reminderText } from '../public/js/core/reminders.js';

const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '127.0.0.1';
const TRUST_PROXY = process.env.TRUST_PROXY === '1';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; manifest-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  ...(TRUST_PROXY ? { 'Strict-Transport-Security': 'max-age=31536000' } : {}),
};

// The service worker gets a build id + asset list, so every deploy refreshes the offline cache.
function buildServiceWorker() {
  const files = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name !== 'sw.js' && !e.name.startsWith('.')) files.push(full);
    }
  };
  walk(PUBLIC);
  const hash = crypto.createHash('sha256');
  for (const f of files.sort()) hash.update(f).update(fs.readFileSync(f));
  const assets = files.map((f) => '/' + path.relative(PUBLIC, f).split(path.sep).join('/'));
  return fs.readFileSync(path.join(PUBLIC, 'sw.js'), 'utf8')
    .replace('__BUILD__', hash.digest('hex').slice(0, 12))
    .replace('__ASSETS__', JSON.stringify(assets));
}
let swCache = null;
const serviceWorker = () => (process.env.NODE_ENV === 'production' && swCache) || (swCache = buildServiceWorker());

const clientIp = (req) => (TRUST_PROXY && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress;

function send(res, status, body, headers = {}) {
  const isJson = typeof body !== 'string' && !Buffer.isBuffer(body);
  res.writeHead(status, {
    ...SECURITY_HEADERS,
    ...(isJson ? { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } : {}),
    ...headers,
  });
  res.end(isJson ? JSON.stringify(body) : body);
}

function readJson(req, limit = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(Object.assign(new Error('Too large'), { status: 413 })); req.destroy(); }
      else chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); }
      catch { reject(Object.assign(new Error('Invalid JSON'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

async function api(req, res, url) {
  const p = url.pathname;
  const m = req.method;
  if (m === 'POST' && req.headers['x-myday'] !== '1') return send(res, 403, { error: 'Missing request header' }); // CSRF guard

  if (p === '/api/health') return send(res, 200, { ok: true });
  if (p === '/api/session' && m === 'GET') return send(res, 200, { signedIn: isAuthed(req), passwordSet: passwordIsSet() });
  if (p === '/api/login' && m === 'POST') {
    const body = await readJson(req, 4096);
    const r = login(body.password, clientIp(req));
    return r.ok ? send(res, 200, { ok: true }, { 'Set-Cookie': r.cookie }) : send(res, r.status, { error: r.error });
  }
  if (p === '/api/logout' && m === 'POST') return send(res, 200, { ok: true }, { 'Set-Cookie': logout(req) });

  if (!isAuthed(req)) return send(res, 401, { error: 'Please sign in' });

  if (p === '/api/sync' && m === 'GET') return send(res, 200, changesSince(Number(url.searchParams.get('since') || 0)));
  if (p === '/api/sync' && m === 'POST') {
    const body = await readJson(req);
    if (!Array.isArray(body.changes) || body.changes.length > 5000) return send(res, 400, { error: 'Invalid changes' });
    return send(res, 200, { results: applyChanges(body.changes) });
  }
  if (p === '/api/export' && m === 'GET') {
    return send(res, 200, { app: 'my-day', version: 1, exportedAt: new Date().toISOString(), source: 'server', records: exportAll() });
  }
  if (p === '/api/push/key' && m === 'GET') return send(res, 200, { publicKey: vapid.publicKey });
  if (p === '/api/push/status' && m === 'POST') {
    const body = await readJson(req, 8192);
    return send(res, 200, subscriptionStatus(body.endpoint));
  }
  if (p === '/api/push/subscribe' && m === 'POST') {
    const body = await readJson(req, 8192);
    try { saveSubscription(body.subscription, body.label); } catch (e) { return send(res, 400, { error: e.message }); }
    return send(res, 200, { ok: true });
  }
  if (p === '/api/push/unsubscribe' && m === 'POST') {
    const body = await readJson(req, 8192);
    removeSubscription(String(body.endpoint || ''));
    return send(res, 200, { ok: true });
  }
  if (p === '/api/push/test' && m === 'POST') {
    const body = await readJson(req, 1024);
    if (!body.delaySeconds) {
      const devices = await sendToAll({ title: 'My Day', body: reminderText('test'), tag: 'test-now', url: '/#more/notifications' });
      return send(res, 200, { ok: true, devices });
    }
    return send(res, 200, { ok: true, scheduledIn: scheduleTest(body.delaySeconds) });
  }
  return send(res, 404, { error: 'Not found' });
}

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  if (rel === '/sw.js') {
    return send(res, 200, serviceWorker(), { 'Content-Type': MIME['.js'], 'Cache-Control': 'no-cache', 'Service-Worker-Allowed': '/' });
  }
  const file = path.join(PUBLIC, path.normalize(rel));
  if (!file.startsWith(PUBLIC + path.sep)) return send(res, 400, 'Bad path', { 'Content-Type': 'text/plain' });
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
    const ext = path.extname(file);
    res.writeHead(200, {
      ...SECURITY_HEADERS,
      'Content-Type': MIME[ext] || 'application/octet-stream',
      // The service worker handles offline caching; always revalidate with the server.
      'Cache-Control': 'no-cache',
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const start = Date.now();
  const url = new URL(req.url, 'http://localhost');
  // Log only method, path and status — never bodies, query strings or titles.
  res.on('finish', () => {
    if (url.pathname.startsWith('/api/') || res.statusCode >= 400) console.log(`${req.method} ${url.pathname} ${res.statusCode} ${Date.now() - start}ms`);
  });
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', { 'Content-Type': 'text/plain' });
    serveStatic(req, res, url);
  } catch (e) {
    if (!res.headersSent) send(res, e.status || 500, { error: e.status ? e.message : 'Server error' });
    if (!e.status) console.error('error:', e.message);
  }
});

if (!passwordIsSet()) console.warn('No password set yet. Run: npm run set-password');
startScheduler();
startBackups();
server.listen(PORT, HOST, () => console.log(`My Day listening on http://${HOST}:${PORT}`));
