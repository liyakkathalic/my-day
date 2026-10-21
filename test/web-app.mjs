// Simulated checks for the claude.ai web-app edition (dist-artifact/my-day.html).
// The claude.ai runtime is replaced by a small stand-in: an in-memory document
// store shared by two browser "devices". Real claude.ai behaviour is not covered.
// Usage: npm run build:web && node test/web-app.mjs
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const page = fs.readFileSync(new URL('../dist-artifact/my-day.html', import.meta.url), 'utf8');
// Same skeleton the publish step wraps around the page.
const doc = `<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui}</style></head><body>${page}</body></html>`;
const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(doc); }).listen(8093);

const store = new Map(); // path -> { body, version }
let version = 0;
const saved = [];

// Runs inside the page: a minimal window.claude with db, user and downloads.
const mockRuntime = (withDb) => {
  if (!withDb) return;
  const call = (op, ...args) => window.__db(op, ...args);
  const snapshotOf = (id, body) => ({ id, exists: !!body, data: () => body || undefined, metadata: { fromCache: false, hasPendingWrites: false } });
  const docRef = (path) => ({
    id: path.split('/').pop(), path,
    get: async () => snapshotOf(path.split('/').pop(), await call('get', path)),
    set: async (data) => { await call('set', path, data); },
    update: async (data) => { await call('update', path, data); },
    delete: async () => { await call('delete', path); },
  });
  const collection = (path) => ({
    path,
    doc: (id) => { if (!/^[A-Za-z0-9_\-.~:@+]+$/.test(id)) throw new TypeError('bad segment'); return docRef(`${path}/${id}`); },
    onSnapshot(next) {
      let seen = new Map();
      const poll = async () => {
        const all = await call('list', path);
        const changes = [];
        for (const [p, { body, version: v }] of Object.entries(all)) {
          if (seen.get(p) !== v) changes.push({ type: seen.has(p) ? 'modified' : 'added', doc: snapshotOf(p.split('/').pop(), body) });
        }
        seen = new Map(Object.entries(all).map(([p, x]) => [p, x.version]));
        next({ docs: [], size: 0, empty: false, docChanges: () => changes, metadata: { fromCache: false, hasPendingWrites: false } });
      };
      poll();
      const t = setInterval(poll, 400);
      return () => clearInterval(t);
    },
  });
  const caps = {
    db: { doc: docRef, collection },
    user: { id: async () => 'user-123', isOwner: () => true },
    downloads: { save: async ({ filename, data }) => { await window.__saved(filename, data); return { status: 'saved' }; } },
  };
  window.claude = { use: async (name) => (await new Promise((r) => setTimeout(r, 150)), caps[name] || null) };
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
async function device(withDb = true) {
  const ctx = await browser.newContext({ viewport: { width: 440, height: 956 }, isMobile: true, hasTouch: true, timezoneId: 'America/New_York' });
  await ctx.exposeFunction('__db', (op, path, data) => {
    if (op === 'get') return store.get(path)?.body ?? null;
    if (op === 'set') { store.set(path, { body: data, version: ++version }); return null; }
    if (op === 'delete') { store.delete(path); return null; }
    if (op === 'list') return Object.fromEntries([...store].filter(([p]) => p.startsWith(path + '/')));
    return null;
  });
  await ctx.exposeFunction('__saved', (filename, data) => { saved.push({ filename, data }); });
  await ctx.addInitScript(mockRuntime, withDb);
  const p = await ctx.newPage();
  p.setDefaultTimeout(8000);
  p.errors = [];
  p.on('pageerror', (e) => p.errors.push(e.message));
  await p.goto('http://localhost:8093/');
  await p.getByRole('heading', { name: 'Today’s three priorities' }).waitFor();
  return { ctx, p };
}
const results = [];
async function check(name, fn) {
  try { await fn(); results.push(true); console.log('PASS', name); }
  catch (e) { results.push(false); console.log('FAIL', name, '\n   ', e.message.split('\n').slice(0, 6).join('\n    ')); }
}
async function capture(p, title) {
  await p.getByRole('button', { name: 'Quick capture' }).click();
  await p.getByLabel('What’s on your mind?').fill(title);
  await p.getByRole('button', { name: 'Save', exact: true }).click();
  await p.getByText(title).first().waitFor();
}
const pill = (p, text) => p.waitForFunction((t) => document.querySelector('.pill')?.textContent === t, text, { timeout: 8000 });

await check('Without a cloud store the app still works and says so', async () => {
  const { ctx, p } = await device(false);
  await capture(p, 'Local only task');
  await pill(p, 'On this device only');
  assert.deepEqual(p.errors, []);
  await ctx.close();
});

const { p: A } = await device();
await check('Device A saves to the private cloud area', async () => {
  await pill(A, 'Saved');
  await capture(A, 'Call the CA about GST');
  await pill(A, 'Saved');
  const keys = [...store.keys()];
  assert.ok(keys.every((k) => k.startsWith('data/users/user-123/')), 'all records in the private subtree');
  assert.ok([...store.values()].some((x) => x.body.data?.title === 'Call the CA about GST'));
});

let B;
await check('Device B sees the same data, including the default schedule only once', async () => {
  ({ p: B } = await device());
  await B.getByText('Call the CA about GST').waitFor();
  await pill(B, 'Saved');
  assert.equal([...store.keys()].filter((k) => k.endsWith('config~schedule')).length, 1);
});

await check('Live update: a change on B appears on A without reloading', async () => {
  await capture(B, 'Book plumber');
  await A.getByText('Book plumber').waitFor();
});

await check('Delete uses an in-app confirmation (browser dialogs are blocked)', async () => {
  await A.getByRole('button', { name: /^Book plumber/ }).click();
  await A.getByRole('button', { name: 'Edit' }).click();
  await A.getByRole('button', { name: 'Delete', exact: true }).click();
  await A.getByText('Delete this task? This cannot be undone.').waitFor();
  await A.locator('.sheet').last().getByRole('button', { name: 'Delete', exact: true }).click();
  await pill(A, 'Saved');
  await B.getByText('Book plumber').waitFor({ state: 'detached' });
});

await check('Export goes through the platform save prompt', async () => {
  await A.goto('http://localhost:8093/#more/data');
  await A.getByRole('button', { name: 'Save a backup file' }).click();
  await A.getByText('Backup file saved').waitFor();
  const obj = JSON.parse(saved.at(-1).data);
  assert.equal(obj.app, 'my-day');
  assert.ok(obj.records.some((r) => r.data.title === 'Call the CA about GST'));
});

await check('Reminders page explains web-app limits honestly', async () => {
  await A.goto('http://localhost:8093/#more/notifications');
  await A.getByText('cannot send phone notifications when it is closed').waitFor();
});

await check('No horizontal overflow and no script errors', async () => {
  for (const r of ['today', 'tasks/today', 'week', 'more', 'more/sync', 'more/data', 'more/money', 'more/content', 'more/office', 'more/schedule']) {
    await A.goto(`http://localhost:8093/#${r}`);
    await A.waitForTimeout(100);
    assert.equal(await A.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, r);
  }
  assert.deepEqual([...A.errors, ...B.errors], []);
});

await browser.close();
server.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} simulated web-app checks passed (stand-in runtime, not claude.ai).`);
process.exit(results.every(Boolean) ? 0 : 1);
