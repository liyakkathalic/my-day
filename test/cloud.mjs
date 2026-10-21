// Checks for the Cloudflare edition: runs the real Worker locally with
// `wrangler dev` (local D1 in .wrangler/), then two browser "devices".
// Usage: npm run build:cloud && node test/cloud.mjs
import { chromium } from 'playwright-core';
import { spawn, execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const PORT = 8797;
const BASE = `http://localhost:${PORT}/`;
const CODE = 'TEST-CODE-0001';
const PASSWORD = 'correct horse battery';
const wrangler = (...args) => execFileSync('npx', ['wrangler', ...args], { stdio: 'pipe', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } });

fs.rmSync(new URL('../.wrangler/state', import.meta.url), { recursive: true, force: true });
wrangler('d1', 'execute', 'my-day', '--local', '--file', 'worker/schema.sql');
const codeHash = crypto.createHash('sha256').update(CODE).digest('hex');
wrangler('d1', 'execute', 'my-day', '--local', '--command', `INSERT INTO meta (k, v) VALUES ('setup_code', '${codeHash}')`);

const dev = spawn('npx', ['wrangler', 'dev', '--port', String(PORT)], { stdio: 'pipe', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } });
let log = '';
dev.stdout.on('data', (d) => { log += d; });
dev.stderr.on('data', (d) => { log += d; });
for (let i = 0; ; i++) {
  try { if ((await fetch(BASE + 'api/health')).ok) break; } catch { /* starting */ }
  if (i > 120) { console.log(log); throw new Error('wrangler dev did not start'); }
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const results = [];
async function check(name, fn) {
  try { await fn(); results.push(true); console.log('PASS', name); }
  catch (e) { results.push(false); console.log('FAIL', name, '\n   ', e.message.split('\n').slice(0, 6).join('\n    ')); }
}
async function device() {
  const ctx = await browser.newContext({ viewport: { width: 440, height: 956 }, isMobile: true, hasTouch: true, timezoneId: 'Asia/Kolkata' });
  const p = await ctx.newPage();
  p.setDefaultTimeout(10000);
  p.errors = [];
  p.on('pageerror', (e) => p.errors.push(e.message));
  await p.goto(BASE + '#today');
  await p.getByRole('heading', { name: 'Today’s three priorities' }).waitFor();
  return p;
}
async function capture(p, title) {
  await p.goto(BASE + '#today');
  await p.getByRole('button', { name: 'Quick capture' }).click();
  await p.getByLabel('What’s on your mind?').fill(title);
  await p.getByRole('button', { name: 'Save', exact: true }).click();
  await p.getByText(title).first().waitFor();
}
const pill = (p, text) => p.waitForFunction((t) => document.querySelector('.pill')?.textContent === t, text, { timeout: 10000 });

const A = await device();
await check('Before sign-in: Today asks to set up a password', async () => {
  await A.getByText('Set up your password').waitFor();
});
await check('API refuses data without sign-in, and POSTs without the app header', async () => {
  assert.equal((await fetch(BASE + 'api/sync?since=0')).status, 401);
  assert.equal((await fetch(BASE + 'api/login', { method: 'POST', body: '{}' })).status, 403);
});
await check('Wrong setup code is refused', async () => {
  await A.goto(BASE + '#more/sync');
  await A.getByLabel('Setup code').fill('WRONG-CODE-0000');
  await A.getByLabel('New password').fill(PASSWORD);
  await A.getByLabel('Type it again').fill(PASSWORD);
  await A.getByRole('button', { name: 'Save password and sign in' }).click();
  await A.getByText('That setup code is not correct.').waitFor();
});
await check('Device A creates the password with the setup code and syncs', async () => {
  await A.getByLabel('Setup code').fill(CODE.toLowerCase());
  await A.getByRole('button', { name: 'Save password and sign in' }).click();
  await A.getByText('You are signed in.').waitFor();
  await capture(A, 'Call the CA about GST');
  await pill(A, 'Saved');
});
await check('Setup code cannot be used twice', async () => {
  const r = await fetch(BASE + 'api/setup', { method: 'POST', headers: { 'X-MyDay': '1' }, body: JSON.stringify({ code: CODE, password: 'another password 1' }) });
  assert.equal(r.status, 409);
});
let B;
await check('Device B: wrong password refused, right password shows A’s task', async () => {
  B = await device();
  await B.getByText('Sign in to sync').waitFor();
  await B.goto(BASE + '#more/sync');
  await B.getByLabel('Password').fill('not the password');
  await B.getByRole('button', { name: 'Sign in' }).click();
  await B.getByText('That password is not correct.').waitFor();
  await B.getByLabel('Password').fill(PASSWORD);
  await B.getByRole('button', { name: 'Sign in' }).click();
  await B.goto(BASE + '#today');
  await B.getByText('Call the CA about GST').waitFor();
});
await check('Live: a task added on B appears on A within seconds, without reloading', async () => {
  await A.goto(BASE + '#today');
  const t0 = Date.now();
  await capture(B, 'Book plumber');
  await A.getByText('Book plumber').waitFor({ timeout: 12000 });
  console.log(`    (arrived after ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
});
await check('Live: marking done on A shows on B', async () => {
  await A.getByRole('button', { name: 'Mark “Book plumber” as done' }).click();
  await B.goto(BASE + '#tasks/completed');
  await B.getByText('Book plumber').waitFor({ timeout: 12000 });
});
await check('Server never overwrites a newer copy: stale changes come back as conflicts', async () => {
  const login = await fetch(BASE + 'api/login', { method: 'POST', headers: { 'X-MyDay': '1' }, body: JSON.stringify({ password: PASSWORD }) });
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const post = async (changes) => (await (await fetch(BASE + 'api/sync', { method: 'POST', headers: { 'X-MyDay': '1', cookie }, body: JSON.stringify({ changes }) })).json()).results;
  const [r1] = await post([{ col: 'tasks', id: 'api-test', baseRev: 0, data: { title: 'v1' } }]);
  assert.equal(r1.ok, true); assert.equal(r1.rev, 1);
  const [r2] = await post([{ col: 'tasks', id: 'api-test', baseRev: 0, data: { title: 'other device' } }]);
  assert.equal(r2.conflict, true); assert.equal(r2.server.data.title, 'v1');
  const [r3] = await post([{ col: 'tasks', id: 'api-test', baseRev: 1, data: { title: 'v2' } }]);
  assert.equal(r3.ok, true); assert.equal(r3.rev, 2);
  const [r4] = await post([{ col: 'tasks', id: 'api-test', baseRev: 1, data: { title: 'stale' } }]);
  assert.equal(r4.conflict, true); assert.equal(r4.server.data.title, 'v2');
  const [r5] = await post([{ col: 'nope', id: 'x', baseRev: 0, data: {} }]);
  assert.equal(r5.ok, false);
  const since = await (await fetch(BASE + 'api/sync?since=0', { headers: { cookie } })).json();
  const seqs = since.records.map((r) => r.seq);
  assert.deepEqual(seqs, [...seqs].sort((x, y) => x - y));
  assert.equal(since.records.find((r) => r.id === 'api-test').data.title, 'v2');
});
await check('Signed-in session survives a reload', async () => {
  await A.reload();
  await pill(A, 'Saved');
});
await check('No horizontal overflow and no script errors', async () => {
  for (const r of ['today', 'tasks/today', 'week', 'more', 'more/sync', 'more/notifications', 'more/install', 'more/data']) {
    await A.goto(BASE + '#' + r);
    await A.waitForTimeout(150);
    assert.equal(await A.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, r);
  }
  assert.deepEqual([...A.errors, ...B.errors], []);
});

await browser.close();
dev.kill();
if (!results.every(Boolean)) console.log(log.split('\n').slice(-25).join('\n'));
console.log(`\n${results.filter(Boolean).length}/${results.length} Cloudflare-edition checks passed (local Worker + D1, headless Chromium).`);
process.exit(results.every(Boolean) ? 0 : 1);
