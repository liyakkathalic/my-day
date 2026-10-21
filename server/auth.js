// Single-user password sign-in. The password hash (scrypt) lives in the
// database and is set from the command line, never through a public page.
import crypto from 'node:crypto';
import { db, getMeta, setMeta } from './db.js';

const COOKIE = 'md_session';
const SESSION_DAYS = 180; // long-lived so the Home Screen app stays signed in
const SECURE = process.env.INSECURE_COOKIES !== '1';

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function setPassword(pw) {
  setMeta('password', hashPassword(pw));
  db.prepare('DELETE FROM sessions').run(); // sign out everywhere
}

export const passwordIsSet = () => !!getMeta('password');

function verifyPassword(pw) {
  const stored = getMeta('password');
  if (!stored || typeof pw !== 'string' || pw.length > 500) {
    crypto.scryptSync('dummy', 'dummy-salt-value', 64); // keep timing similar
    return false;
  }
  const [, saltB64, hashB64] = stored.split('$');
  const expected = Buffer.from(hashB64, 'base64');
  const got = crypto.scryptSync(pw, Buffer.from(saltB64, 'base64'), 64, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(expected, got);
}

// Simple brute-force protection: per-IP lockout plus a global ceiling.
const attempts = new Map();
let globalFails = [];
function limited(ip) {
  const now = Date.now();
  globalFails = globalFails.filter((t) => now - t < 3600_000);
  const a = attempts.get(ip);
  return (a && a.until > now) || globalFails.length >= 30;
}
function recordFail(ip) {
  const now = Date.now();
  globalFails.push(now);
  const a = attempts.get(ip) || { count: 0, until: 0 };
  a.count += 1;
  if (a.count >= 5) { a.until = now + 15 * 60_000; a.count = 0; }
  attempts.set(ip, a);
}

const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');

export function login(pw, ip) {
  if (limited(ip)) return { ok: false, status: 429, error: 'Too many attempts. Please wait 15 minutes and try again.' };
  if (!verifyPassword(pw)) {
    recordFail(ip);
    return { ok: false, status: 401, error: 'That password is not correct.' };
  }
  attempts.delete(ip);
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  db.prepare('INSERT INTO sessions (token_hash, created, expires) VALUES (?, ?, ?)').run(sha(token), now, now + SESSION_DAYS * 86400_000);
  db.prepare('DELETE FROM sessions WHERE expires < ?').run(now);
  return { ok: true, cookie: `${COOKIE}=${token}; HttpOnly; ${SECURE ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=${SESSION_DAYS * 86400}` };
}

function readCookie(req) {
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}

export function isAuthed(req) {
  const token = readCookie(req);
  if (!token) return false;
  const row = db.prepare('SELECT expires FROM sessions WHERE token_hash = ?').get(sha(token));
  return !!row && row.expires > Date.now();
}

export function logout(req) {
  const token = readCookie(req);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha(token));
  return `${COOKIE}=; HttpOnly; ${SECURE ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=0`;
}
