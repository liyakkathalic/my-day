// Simulated checks for the GitHub Pages edition (dist-pages/), served under
// /my-day/ like GitHub Pages does. Usage: npm run build:pages && node test/pages.mjs
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const dir = new URL('../dist-pages/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!u.startsWith('/my-day/')) { res.writeHead(404); return res.end(); }
  let f = path.join(dir, u.slice('/my-day/'.length) || 'index.html');
  if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(dir, 'index.html');
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  res.end(fs.readFileSync(f));
}).listen(8094);
const BASE = 'http://localhost:8094/my-day/';

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width: 440, height: 956 }, isMobile: true, hasTouch: true, timezoneId: 'Europe/London' });
const p = await ctx.newPage();
p.setDefaultTimeout(8000);
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
const results = [];
async function check(name, fn) {
  try { await fn(); results.push(true); console.log('PASS', name); }
  catch (e) { results.push(false); console.log('FAIL', name, '\n   ', e.message.split('\n').slice(0, 6).join('\n    ')); }
}

await check('Loads under a sub-path and shows device-only status', async () => {
  await p.goto(BASE + '#today');
  await p.getByRole('heading', { name: 'Today’s three priorities' }).waitFor();
  await p.waitForFunction(() => document.querySelector('.pill')?.textContent === 'Saved on this device');
});
await check('Capture and reload keeps the task', async () => {
  await p.getByRole('button', { name: 'Quick capture' }).click();
  await p.getByLabel('What’s on your mind?').fill('Pages edition task');
  await p.getByRole('button', { name: 'Save', exact: true }).click();
  await p.reload();
  await p.getByText('Pages edition task').waitFor();
});
await check('Service worker installs and the app opens offline', async () => {
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  await p.waitForFunction(() => !!navigator.serviceWorker.controller);
  await ctx.setOffline(true);
  await p.reload();
  await p.getByText('Pages edition task').waitFor();
  await ctx.setOffline(false);
});
await check('Manifest and icons resolve under the sub-path', async () => {
  const m = await p.evaluate(async () => (await fetch('manifest.webmanifest')).json());
  assert.equal(m.start_url, './#today');
  const ok = await p.evaluate(async () => (await fetch('icons/apple-touch-icon.png')).ok);
  assert.ok(ok);
});
await check('Data page explains device storage and links to the synced version', async () => {
  await p.goto(BASE + '#more/sync');
  await p.getByText('Nothing is sent to any server').waitFor();
  await p.getByRole('link', { name: 'Open the claude.ai version' }).waitFor();
});
await check('No horizontal overflow and no script errors', async () => {
  for (const r of ['today', 'tasks/today', 'week', 'more', 'more/notifications', 'more/data', 'more/install']) {
    await p.goto(BASE + '#' + r);
    await p.waitForTimeout(100);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, r);
  }
  assert.deepEqual(errors, []);
});

await browser.close();
server.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} simulated Pages checks passed.`);
process.exit(results.every(Boolean) ? 0 : 1);
