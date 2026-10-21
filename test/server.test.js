import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'myday-test-'));
const { applyChanges, changesSince } = await import('../server/sync.js');
const { tick } = await import('../server/scheduler.js');
const { saveSubscription } = await import('../server/push.js');
const { db } = await import('../server/db.js');
const { zonedToUtc } = await import('../public/js/core/time.js');
const { defaultReminders, defaultSettings } = await import('../public/js/core/defaults.js');

test('sync accepts a change based on the current revision and rejects stale ones', () => {
  const [a] = applyChanges([{ col: 'tasks', id: 't1', baseRev: 0, data: { title: 'Call bank', status: 'open' } }]);
  assert.equal(a.ok, true);
  assert.equal(a.rev, 1);
  // Device B edits from rev 1 -> rev 2.
  const [b] = applyChanges([{ col: 'tasks', id: 't1', baseRev: 1, data: { title: 'Call bank (B)', status: 'open' } }]);
  assert.equal(b.rev, 2);
  // Device A, still on rev 1, tries to save: conflict, server copy returned, nothing overwritten.
  const [c] = applyChanges([{ col: 'tasks', id: 't1', baseRev: 1, data: { title: 'Call bank (A)', status: 'open' } }]);
  assert.equal(c.ok, false);
  assert.equal(c.conflict, true);
  assert.equal(c.server.data.title, 'Call bank (B)');
  const pulled = changesSince(0);
  assert.equal(pulled.records.find((r) => r.id === 't1').data.title, 'Call bank (B)');
});

test('sync rejects unknown collections and invalid data', () => {
  const [r] = applyChanges([{ col: 'users', id: 'x', baseRev: 0, data: {} }]);
  assert.equal(r.ok, false);
});

test('pull returns only changes after the given sequence', () => {
  const before = changesSince(0).seq;
  applyChanges([{ col: 'tasks', id: 't2', baseRev: 0, data: { title: 'Two', status: 'open' } }]);
  const r = changesSince(before);
  assert.deepEqual(r.records.map((x) => x.id), ['t2']);
});

test('scheduler sends each reminder once and skips stale ones', async () => {
  const changes = defaultReminders().map((r) => ({ col: 'reminders', id: r.id, baseRev: 0, data: r }));
  changes.push({ col: 'config', id: 'settings', baseRev: 0, data: defaultSettings() });
  changes.push({ col: 'tasks', id: 'rem1', baseRev: 0, data: { title: 'Private title', status: 'open', plannedDate: '2026-10-22', reminder: { anchor: 'planned', time: '10:00' } } });
  applyChanges(changes);
  saveSubscription({ endpoint: 'https://push.example/1', keys: { p256dh: 'x', auth: 'y' } }, 'test');

  const sent = [];
  const sender = async (sub, payload) => { sent.push(JSON.parse(payload)); };
  const at = (d, t) => zonedToUtc(d, t, 'Asia/Kolkata').getTime();

  db.prepare("DELETE FROM meta WHERE k = 'scheduler_last'").run();
  await tick(at('2026-10-22', '08:59'), sender);
  assert.equal(sent.length, 0);
  await tick(at('2026-10-22', '09:00') + 5000, sender);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].body, 'Time for your office check.');
  // Run the same window again (e.g. restart): no duplicate.
  db.prepare("DELETE FROM meta WHERE k = 'scheduler_last'").run();
  await tick(at('2026-10-22', '09:00') + 20000, sender);
  assert.equal(sent.length, 1);
  // Task reminder text is generic — never the private title.
  await tick(at('2026-10-22', '10:00') + 1000, sender);
  assert.equal(sent.length, 2);
  assert.equal(sent[1].body.includes('Private'), false);

  // Completing a task before its reminder time cancels it.
  applyChanges([{ col: 'tasks', id: 'rem2', baseRev: 0, data: { title: 'x', status: 'done', plannedDate: '2026-10-22', reminder: { anchor: 'planned', time: '11:00' } } }]);
  await tick(at('2026-10-22', '11:00') + 1000, sender);
  assert.equal(sent.length, 2);

  // Server down for hours: the 9:30 PM shutdown reminder is not sent late at 11:50 PM.
  db.prepare("UPDATE meta SET v = ? WHERE k = 'scheduler_last'").run(at('2026-10-22', '20:00'));
  await tick(at('2026-10-22', '23:50'), sender);
  assert.equal(sent.length, 2);
});
