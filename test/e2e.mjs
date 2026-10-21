// Simulated browser checks (headless Chromium with an iPhone-sized viewport).
// These are NOT real-device checks: Safari/WebKit, the iOS keyboard, Home Screen
// mode and Apple push delivery must still be verified on the actual iPhone.
//
// Usage: npm run test:e2e   (starts its own server on port 8091 with a temp data folder)
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const PORT = 8091;
const BASE = `http://localhost:${PORT}`;
const PASSWORD = 'e2e-test-password-123';
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'myday-e2e-'));
const env = { ...process.env, DATA_DIR: dataDir, PORT: String(PORT), INSECURE_COOKIES: '1', MYDAY_PASSWORD: PASSWORD };

await new Promise((res, rej) => spawn('node', ['server/set-password.js'], { env, stdio: 'ignore' }).on('exit', (c) => (c ? rej(new Error('set-password failed')) : res())));
const server = spawn('node', ['server/index.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((r, j) => {
  server.stdout.on('data', (d) => d.toString().includes('listening') && r());
  server.on('exit', () => j(new Error('Test server exited — is port 8091 in use?')));
});
process.on('exit', () => server.kill());

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const IPHONE = { viewport: { width: 440, height: 956 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, timezoneId: 'America/Los_Angeles' };
const results = [];
async function check(name, fn) {
  try { await fn(); results.push(['PASS', name]); console.log('PASS', name); }
  catch (e) { results.push(['FAIL', name, e.message]); console.log('FAIL', name, '\n   ', e.message.split('\n').slice(0, 14).join('\n    ')); }
}
async function device(opts = IPHONE) {
  const ctx = await browser.newContext({ ...opts, acceptDownloads: true });
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  await page.goto(`${BASE}/#today`);
  await page.getByRole('heading', { name: 'Today’s three priorities' }).waitFor();
  return { ctx, page };
}
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
async function capture(page, title, when = 'Today') {
  await page.getByRole('button', { name: 'Quick capture' }).click();
  await page.getByLabel('What’s on your mind?').fill(title);
  await page.getByRole('tab', { name: when }).click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByText(title).first().waitFor();
}
async function signIn(page) {
  await page.goto(`${BASE}/#more/sync`);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('You are signed in').waitFor();
  await page.waitForFunction(() => document.querySelector('.pill')?.textContent === 'Saved', null, { timeout: 10000 });
}
const waitSaved = (page) => page.waitForFunction(() => document.querySelector('.pill')?.textContent === 'Saved', null, { timeout: 10000 });

const ROUTES = ['today', 'tasks/today', 'tasks/week', 'tasks/waiting', 'tasks/later', 'tasks/completed', 'week', 'more',
  'more/schedule', 'more/themes', 'more/routines', 'more/notifications', 'more/sync', 'more/data', 'more/settings',
  'more/install', 'more/office', 'more/content', 'more/money'];

const { ctx: ctxA, page: A } = await device();

await check('Schedule uses Asia/Kolkata even when the device is in another time zone', async () => {
  const shown = await A.locator('.now .eyebrow').first().textContent();
  const ist = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }).format(new Date());
  assert.ok(shown.includes(ist.replace(/ /g, ' ')), `shown "${shown}" vs IST "${ist}"`);
});

for (const [label, vp] of [['iPhone 16 Pro Max 440×956', { width: 440, height: 956 }], ['small phone 320×568', { width: 320, height: 568 }], ['desktop 1280×800', { width: 1280, height: 800 }]]) {
  await check(`No horizontal overflow on any screen — ${label}`, async () => {
    await A.setViewportSize(vp);
    const bad = [];
    for (const r of ROUTES) {
      await A.goto(`${BASE}/#${r}`);
      await A.waitForTimeout(150);
      const o = await overflow(A);
      if (o > 0) bad.push(`${r} (+${o}px)`);
    }
    assert.deepEqual(bad, []);
  });
}
await A.setViewportSize(IPHONE.viewport);

await check('Interactive controls are at least 44px tall (Today, Tasks, More)', async () => {
  const small = [];
  for (const r of ['today', 'tasks/today', 'more', 'more/notifications']) {
    await A.goto(`${BASE}/#${r}`);
    await A.waitForTimeout(150);
    small.push(...await A.evaluate(() => [...document.querySelectorAll('main button, main a, main input:not([type=checkbox]), main select, .bottom-nav a')]
      .filter((el) => el.offsetParent && !el.closest('p') && el.getBoundingClientRect().height < 43.5)
      .map((el) => `${el.tagName} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().height)}px`)));
  }
  assert.deepEqual(small, []);
});

await check('Quick capture works without any onboarding, and tasks survive reload', async () => {
  await A.goto(`${BASE}/#today`);
  await capture(A, 'Call the bank about statement');
  await A.evaluate(() => new Promise((r) => setTimeout(r, 300))); // let the local database write finish
  await A.reload();
  await A.getByText('Call the bank about statement').waitFor();
});

await check('Choose a priority, then Done / Reschedule / Waiting actions', async () => {
  await A.goto(`${BASE}/#today`);
  await A.getByRole('button', { name: /Choose a priority/ }).click();
  await A.locator('.pick-list').getByRole('button', { name: /Call the bank about statement/ }).click();
  const prio = A.locator('.prio');
  await prio.getByText('Call the bank about statement').waitFor();
  await prio.getByRole('button', { name: 'Waiting', exact: true }).click();
  await A.getByLabel('Who am I waiting for?').fill('Bank manager');
  await A.getByRole('button', { name: 'Save', exact: true }).click();
  // Waiting item should not show as a priority or as overdue.
  await A.goto(`${BASE}/#tasks/waiting`);
  await A.getByText('Waiting for Bank manager').waitFor();
  assert.equal(await A.locator('text=overdue').count(), 0);
});

await check('Planned date and real deadline are separate (deadline shows in Upcoming deadlines)', async () => {
  await A.goto(`${BASE}/#tasks/later`);
  await A.getByRole('button', { name: '+ New task' }).click();
  await A.getByLabel('Title').fill('File GST return');
  await A.getByLabel('Real deadline (optional)').fill(new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10));
  await A.getByRole('button', { name: 'Add task' }).click();
  await A.goto(`${BASE}/#today`);
  await A.locator('.deadlines').getByText('File GST return').waitFor();
  assert.equal(await A.locator('.prio').getByText('File GST return').count(), 0);
});

await check('Recurring routine: completing today does not complete tomorrow; rescheduling one day leaves the series', async () => {
  await A.goto(`${BASE}/#more/routines`);
  await A.getByRole('button', { name: '+ New routine' }).click();
  await A.getByLabel('Title').fill('Check stock levels');
  await A.getByRole('button', { name: 'Save', exact: true }).click();
  await A.goto(`${BASE}/#tasks/today`);
  await A.getByRole('button', { name: 'Mark “Check stock levels” as done' }).click();
  await A.goto(`${BASE}/#tasks/week`);
  const weekCount = await A.getByText('Check stock levels').count();
  assert.ok(weekCount >= 1, 'future occurrences still open');
  // Reschedule the first future occurrence only.
  await A.getByRole('button', { name: /^Check stock levels/ }).first().click();
  await A.getByRole('button', { name: 'Reschedule' }).click();
  await A.getByText('This moves only this day of the routine').waitFor();
  const target = new Date(Date.now() + 20 * 864e5).toISOString().slice(0, 10);
  await A.getByLabel('New planned date', { exact: true }).last().fill(target);
  await A.getByRole('button', { name: 'Move' }).click();
  await A.goto(`${BASE}/#tasks/week`);
  assert.equal(await A.getByText('Check stock levels').count(), weekCount - 1);
  await A.goto(`${BASE}/#more/routines`);
  await A.getByText('Every day').waitFor(); // series unchanged
});

await check('Schedule block edit: "only this day" leaves other weekdays unchanged', async () => {
  await A.goto(`${BASE}/#more/schedule/1`);
  await A.getByRole('button', { name: /Topic research and references/ }).click();
  await A.getByRole('tab', { name: 'Only Monday' }).click();
  await A.getByLabel('Title').fill('Deep research (Monday)');
  await A.getByRole('button', { name: 'Save', exact: true }).click();
  await A.getByText('Deep research (Monday)').waitFor();
  await A.goto(`${BASE}/#more/schedule/2`);
  await A.getByText('Topic research and references').waitFor();
});

await check('Sign in: local data uploads; a second device sees it', async () => {
  await signIn(A);
  const { ctx, page: B } = await device();
  await signIn(B);
  await B.goto(`${BASE}/#tasks/later`);
  await B.getByText('File GST return').waitFor();
  await B.goto(`${BASE}/#more/schedule/1`);
  await B.getByText('Deep research (Monday)').waitFor();
  await ctx.close();
});

await check('Wrong password is rejected with a clear message', async () => {
  const { ctx, page } = await device();
  await page.goto(`${BASE}/#more/sync`);
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('That password is not correct.').waitFor();
  await ctx.close();
});

await check('Offline changes are shown as unsynced and sync on reconnection', async () => {
  await ctxA.setOffline(true);
  await A.goto(`${BASE}/#today`).catch(() => {});
  await A.evaluate(() => window.dispatchEvent(new Event('offline')));
  await capture(A, 'Offline idea for a video');
  await A.waitForFunction(() => /Offline · \d+ not synced/.test(document.querySelector('.pill')?.textContent), null, { timeout: 5000 });
  await A.evaluate(() => new Promise((r) => setTimeout(r, 300))); // let the local database write finish
  await A.reload().catch(() => {}); // offline reload is served by the service worker
  await A.getByText('Offline idea for a video').waitFor();
  await ctxA.setOffline(false);
  await A.evaluate(() => window.dispatchEvent(new Event('online')));
  await waitSaved(A);
  const r = await A.evaluate(async () => (await fetch('/api/export')).json());
  assert.ok(r.records.some((x) => x.data.title === 'Offline idea for a video'));
});

await check('Conflicting edits from two devices are never silently overwritten', async () => {
  const { ctx, page: B } = await device();
  await signIn(B);
  await B.goto(`${BASE}/#today`);
  await B.getByText('Offline idea for a video').waitFor();
  await ctxA.setOffline(true); await A.evaluate(() => window.dispatchEvent(new Event('offline')));
  // Device B renames and syncs.
  await B.getByRole('button', { name: /^Offline idea for a video/ }).first().click();
  await B.getByRole('button', { name: 'Edit' }).click();
  await B.getByLabel('Title').fill('Video idea (edited on B)');
  await B.getByRole('button', { name: 'Save', exact: true }).click();
  await waitSaved(B);
  // Device A, offline, renames differently.
  await A.goto(`${BASE}/#today`).catch(() => {});
  await A.getByRole('button', { name: /^Offline idea for a video/ }).first().click();
  await A.getByRole('button', { name: 'Edit' }).click();
  await A.getByLabel('Title').fill('Video idea (edited on A)');
  await A.getByRole('button', { name: 'Save', exact: true }).click();
  await ctxA.setOffline(false); await A.evaluate(() => window.dispatchEvent(new Event('online')));
  await A.getByText(/changed on another device/).first().waitFor({ timeout: 10000 });
  // The server still has B's version until A decides.
  const r = await A.evaluate(async () => (await fetch('/api/export')).json());
  assert.ok(r.records.some((x) => x.data.title === 'Video idea (edited on B)'));
  await A.goto(`${BASE}/#more/sync`);
  await A.getByRole('button', { name: 'Keep this device’s' }).click();
  await waitSaved(A);
  const r2 = await A.evaluate(async () => (await fetch('/api/export')).json());
  assert.ok(r2.records.some((x) => x.data.title === 'Video idea (edited on A)'));
  await ctx.close();
});

let backupPath;
await check('Export creates a backup file containing the data', async () => {
  await A.goto(`${BASE}/#more/data`);
  await A.evaluate(() => { Object.defineProperty(navigator, 'canShare', { value: undefined }); });
  const [dl] = await Promise.all([A.waitForEvent('download'), A.getByRole('button', { name: 'Save a backup file' }).click()]);
  backupPath = path.join(dataDir, 'backup.json');
  await dl.saveAs(backupPath);
  const obj = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  assert.equal(obj.app, 'my-day');
  assert.ok(obj.records.some((x) => x.data.title === 'File GST return'));
  assert.ok(obj.records.some((x) => x.col === 'config' && x.id === 'schedule'));
});

await check('Restore into a fresh device (not signed in) brings everything back', async () => {
  const { ctx, page } = await device();
  await page.goto(`${BASE}/#more/data`);
  await page.locator('input[type=file]').setInputFiles(backupPath);
  await page.getByText('This backup contains').waitFor();
  await page.getByRole('button', { name: 'Add missing and newer items' }).click();
  await page.goto(`${BASE}/#tasks/later`);
  await page.getByText('File GST return').waitFor();
  await page.goto(`${BASE}/#more/schedule/1`);
  await page.getByText('Deep research (Monday)').waitFor();
  await ctx.close();
});

await check('Restore rejects a file that is not a My Day backup', async () => {
  const bad = path.join(dataDir, 'bad.json');
  fs.writeFileSync(bad, '{"hello":1}');
  await A.goto(`${BASE}/#more/data`);
  await A.locator('input[type=file]').setInputFiles(bad);
  await A.getByText('This file is not a My Day backup.').waitFor();
});

await check('Notifications: iPhone in Safari (not installed) is told to add to Home Screen', async () => {
  const ctx = await browser.newContext({ ...IPHONE, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/#more/notifications`);
  await page.getByText('notifications only work in the Home Screen app').waitFor();
  await ctx.close();
});

await check('Notifications: permission denied shows how to fix it', async () => {
  const ctx = await browser.newContext(IPHONE);
  await ctx.addInitScript(() => Object.defineProperty(Notification, 'permission', { get: () => 'denied' }));
  const page = await ctx.newPage();
  await page.goto(`${BASE}/#today`);
  await signIn(page);
  await page.goto(`${BASE}/#more/notifications`);
  await page.getByText('Notifications are turned off for My Day').waitFor();
  await ctx.close();
});

await check('Notifications: offline state is explained', async () => {
  await ctxA.setOffline(true); await A.evaluate(() => window.dispatchEvent(new Event('offline')));
  await A.goto(`${BASE}/#more/notifications`).catch(() => {});
  await A.getByText('You are offline. Notification settings need an internet connection.').waitFor();
  await ctxA.setOffline(false); await A.evaluate(() => window.dispatchEvent(new Event('online')));
});

await check('Notifications: Enable button and "not asked yet" status when signed in and online', async () => {
  await A.goto(`${BASE}/#more/notifications`);
  await A.getByRole('button', { name: 'Enable Notifications' }).waitFor();
  await A.getByText(/permission not asked yet/).waitFor();
  await A.getByText(/Do not rely on them as an alarm/).waitFor();
});

await check('Sheets stay above a simulated on-screen keyboard', async () => {
  await A.goto(`${BASE}/#today`);
  await A.getByRole('button', { name: 'Quick capture' }).click();
  // Simulate the keyboard by setting the variables the viewport tracker sets.
  await A.evaluate(() => { document.documentElement.style.setProperty('--kb', '340px'); document.documentElement.style.setProperty('--vvh', '616px'); document.body.classList.add('kb-open'); });
  const box = await A.getByRole('button', { name: 'Save', exact: true }).boundingBox();
  assert.ok(box.y + box.height <= 956 - 340, `Save button bottom ${box.y + box.height} is under the keyboard`);
  assert.equal(await A.locator('.bottom-nav').isVisible(), false);
  await A.keyboard.press('Escape');
});

await check('Office, Content and Money basics', async () => {
  await A.goto(`${BASE}/#more/office`);
  await A.getByLabel('Decision').fill('Approve new supplier');
  await A.getByRole('button', { name: 'Add decision' }).click();
  await A.getByRole('button', { name: 'Create a task from this' }).click();
  await A.goto(`${BASE}/#tasks/today`);
  await A.getByText('Approve new supplier').waitFor();
  await A.goto(`${BASE}/#more/content`);
  await A.getByRole('button', { name: '+ New item' }).click();
  await A.getByLabel('Title').fill('Reaction: budget news');
  await A.getByRole('button', { name: 'Save', exact: true }).click();
  await A.getByRole('button', { name: 'Move to Research' }).click();
  await A.getByText('Standalone recording · Research').waitFor();
  await A.goto(`${BASE}/#more/money`);
  await A.getByRole('button', { name: '+ New entry' }).click();
  await A.locator('#me-type').selectOption('receivable');
  await A.getByLabel('Amount (₹)').fill('15000');
  await A.getByLabel('Who owes me').fill('Client A');
  await A.getByRole('button', { name: 'Save', exact: true }).click();
  await A.locator('.sums').getByText('₹15,000').waitFor();
  await A.getByRole('button', { name: 'Received', exact: true }).click();
  await A.getByRole('button', { name: 'Mark as received' }).click();
  await A.locator('.mini-stats div', { hasText: 'Received' }).getByText('₹15,000').waitFor();
});

await check('Money: expense by category, dashboard, and a regular payment that comes back next month', async () => {
  await A.goto(`${BASE}/#more/money`);
  await A.getByRole('button', { name: '+ Expense' }).click();
  await A.getByLabel('Amount (₹)').fill('450');
  await A.getByRole('button', { name: 'Food & groceries' }).click();
  await A.getByRole('button', { name: 'Save', exact: true }).click();
  await A.locator('.cat-bars').getByText('Food & groceries').waitFor();
  await A.locator('.hero-num').getByText('₹450').waitFor();
  await A.getByRole('button', { name: '+ Add', exact: true }).click();
  await A.getByLabel('Name').fill('Car loan EMI');
  await A.locator('#bl-amt').fill('12000');
  await A.getByRole('button', { name: 'Save', exact: true }).click();
  await A.locator('.bill-list').getByText('Car loan EMI').waitFor();
  await A.getByRole('button', { name: 'Mark Car loan EMI as paid' }).click();
  await A.getByRole('button', { name: 'Mark as paid' }).click();
  await A.locator('.cat-bars').getByText('EMI & loans').waitFor();
  await A.locator('.hero-num').getByText('₹12,450').waitFor();
  await A.goto(`${BASE}/#today`);
  await A.getByRole('heading', { name: 'Today’s three priorities' }).waitFor();
  assert.equal(await A.locator('.deadlines').getByText('Car loan EMI').count(), 0); // next one is a month away
});

await check('No JavaScript errors during the run', async () => {
  assert.deepEqual(A.errors, []);
});

await browser.close();
server.kill();
const failed = results.filter((r) => r[0] === 'FAIL');
console.log(`\n${results.length - failed.length}/${results.length} simulated checks passed (headless Chromium, not a real iPhone).`);
process.exit(failed.length ? 1 : 0);
