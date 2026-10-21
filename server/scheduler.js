// Server-side reminder scheduler. Runs every 30 seconds whether or not the app
// is open. Each reminder occurrence has a unique key; the key is written to
// sent_log in the same step that claims it, so a reminder is sent at most once
// even across restarts. Reminders missed by more than GRACE (e.g. server was
// down) are skipped rather than delivered late in a burst.
import { db, getMeta, setMeta } from './db.js';
import { liveData } from './sync.js';
import { sendToAll } from './push.js';
import { dueReminders, reminderText } from '../public/js/core/reminders.js';
import { defaultSettings } from '../public/js/core/defaults.js';

export const GRACE_MS = 15 * 60_000;
const claim = db.prepare('INSERT OR IGNORE INTO sent_log (key, fire_at, sent_at, devices) VALUES (?, ?, ?, 0)');
const setDevices = db.prepare('UPDATE sent_log SET devices = ? WHERE key = ?');

function loadData() {
  const config = liveData('config');
  const settings = { ...defaultSettings(), ...(config.find((c) => c.id === 'settings') || {}) };
  return { reminders: liveData('reminders'), tasks: liveData('tasks'), settings };
}

export async function tick(now = Date.now(), sender) {
  const last = Number(getMeta('scheduler_last') || 0);
  const from = Math.max(last, now - GRACE_MS);
  const due = dueReminders(loadData(), from, now);
  let sent = 0;
  for (const d of due) {
    if (claim.run(d.key, d.fireAt, now).changes !== 1) continue; // already sent
    const devices = await sendToAll({ title: 'My Day', body: reminderText(d.textKey), tag: d.textKey, url: '/#today' }, sender);
    setDevices.run(devices, d.key);
    sent++;
  }
  const tests = db.prepare('SELECT id FROM test_jobs WHERE done = 0 AND fire_at <= ?').all(now);
  for (const t of tests) {
    if (db.prepare('UPDATE test_jobs SET done = 1 WHERE id = ? AND done = 0').run(t.id).changes !== 1) continue;
    await sendToAll({ title: 'My Day', body: reminderText('test'), tag: `test-${t.id}`, url: '/#more/notifications' }, sender);
    sent++;
  }
  setMeta('scheduler_last', now);
  if (sent) console.log(`scheduler: sent ${sent} notification(s)`);
  return { due: due.length, sent };
}

export function scheduleTest(delaySeconds) {
  const d = Math.min(Math.max(Number(delaySeconds) || 0, 0), 600);
  db.prepare('INSERT INTO test_jobs (fire_at) VALUES (?)').run(Date.now() + d * 1000);
  return d;
}

export function startScheduler() {
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    try { await tick(); } catch (e) { console.error('scheduler error:', e.message); } finally { running = false; }
  };
  run();
  // Prune old send records (> 60 days) once a day.
  setInterval(() => db.prepare('DELETE FROM sent_log WHERE sent_at < ?').run(Date.now() - 60 * 86400_000), 86400_000).unref();
  return setInterval(run, 30_000);
}
