// Web Push (VAPID). Keys come from the environment or are generated once and
// kept in the data folder. Payloads contain only generic text.
import fs from 'node:fs';
import path from 'node:path';
import webpush from 'web-push';
import { db, DATA_DIR } from './db.js';

function loadKeys() {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
  }
  const file = path.join(DATA_DIR, 'vapid.json');
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const keys = webpush.generateVAPIDKeys();
  fs.writeFileSync(file, JSON.stringify(keys), { mode: 0o600 });
  console.log('Generated new VAPID keys in data/vapid.json');
  return keys;
}

export const vapid = loadKeys();
// Apple requires a real contact in the VAPID subject (mailto: or https: URL).
webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:owner@example.com', vapid.publicKey, vapid.privateKey);

export function saveSubscription(sub, label) {
  if (!sub?.endpoint || !/^https:\/\//.test(sub.endpoint) || !sub.keys?.p256dh || !sub.keys?.auth) {
    throw new Error('Invalid subscription');
  }
  db.prepare(`INSERT INTO push_subs (endpoint, p256dh, auth, label, created) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth, label = excluded.label`)
    .run(sub.endpoint, sub.keys.p256dh, sub.keys.auth, String(label || '').slice(0, 60), Date.now());
}

export const removeSubscription = (endpoint) => db.prepare('DELETE FROM push_subs WHERE endpoint = ?').run(endpoint);

export function subscriptionStatus(endpoint) {
  const all = db.prepare('SELECT endpoint, label, created, last_ok, last_error FROM push_subs').all();
  const mine = all.find((s) => s.endpoint === endpoint);
  return {
    devices: all.length,
    thisDevice: mine ? { registered: true, lastDelivered: mine.last_ok, lastError: mine.last_error } : { registered: false },
    lastSent: db.prepare('SELECT MAX(sent_at) AS t FROM sent_log').get().t,
  };
}

/** Sends to every registered device. Returns the number accepted by the push service. */
export async function sendToAll(payload, sender = webpush.sendNotification.bind(webpush)) {
  const subs = db.prepare('SELECT * FROM push_subs').all();
  let ok = 0;
  await Promise.all(subs.map(async (s) => {
    try {
      await sender({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 4 * 3600, urgency: 'high' });
      ok++;
      db.prepare('UPDATE push_subs SET last_ok = ?, last_error = NULL WHERE endpoint = ?').run(Date.now(), s.endpoint);
    } catch (e) {
      const code = e.statusCode || 0;
      if (code === 404 || code === 410) removeSubscription(s.endpoint); // subscription expired or revoked
      else db.prepare('UPDATE push_subs SET last_error = ? WHERE endpoint = ?').run(`HTTP ${code || 'network error'}`, s.endpoint);
      console.warn(`push failed for one device: HTTP ${code || 'network'}`);
    }
  }));
  return ok;
}
