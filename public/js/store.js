// Local-first data store. Every record is kept in IndexedDB on this device and,
// when signed in, synced with the server one record at a time:
// - local edits go into an "outbox" and stay there until the server confirms;
// - each record carries the server revision it was based on, so a newer copy
//   from another device is never silently overwritten — it becomes a conflict
//   that I choose how to resolve.
import { api } from './api.js';
import { IS_ARTIFACT, IS_LOCAL } from './config.js';
import * as cloud from './cloud.js';

const DB_NAME = 'myday';
let idb;
const records = new Map(); // key -> { col, id, rev, deleted, data, lv }
const outbox = new Map();  // key -> { baseRev, gen, force }
const conflicts = new Map(); // key -> { server }
const meta = { lastSeq: 0, signedIn: false, lastSyncAt: 0, lastError: '', localOnlySince: 0 };
const listeners = new Set();
export const status = { syncing: false, online: navigator.onLine, ready: false, cloudChecked: !IS_ARTIFACT };
const echo = new Map(); // key -> revision of my own in-flight cloud write
let cloudFirst;
/** Web-app edition: resolves true once the first cloud copy has arrived (false if unavailable). */
export const cloudReady = new Promise((r) => { cloudFirst = r; });

const k = (col, id) => `${col}/${id}`;
const clone = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('records');
      req.result.createObjectStore('meta');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbAll(store) {
  return new Promise((resolve, reject) => {
    const out = new Map();
    const req = idb.transaction(store).objectStore(store).openCursor();
    req.onsuccess = () => {
      const c = req.result;
      if (c) { out.set(c.key, c.value); c.continue(); } else resolve(out);
    };
    req.onerror = () => reject(req.error);
  });
}

// Writes are batched within the same tick only, so nothing waits on a timer
// (a reload or the app being closed right after a change must not lose it).
let pendingWrites = new Set();
let writeQueued = false;
function persist(keys = []) {
  keys.forEach((x) => pendingWrites.add(x));
  if (!writeQueued) { writeQueued = true; queueMicrotask(flushWrites); }
}
export function flushWrites() {
  writeQueued = false;
  if (!idb) return Promise.resolve();
  const keys = [...pendingWrites];
  pendingWrites = new Set();
  return new Promise((resolve, reject) => {
    const t = idb.transaction(['records', 'meta'], 'readwrite');
    const rs = t.objectStore('records');
    for (const key of keys) {
      const r = records.get(key);
      if (r) rs.put(r, key); else rs.delete(key);
    }
    const ms = t.objectStore('meta');
    ms.put(meta, 'meta');
    ms.put([...outbox], 'outbox');
    ms.put([...conflicts], 'conflicts');
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
}

function emit() { for (const fn of listeners) fn(); }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export async function init() {
  idb = await openDb();
  for (const [key, r] of await idbAll('records')) records.set(key, r);
  const m = await idbAll('meta');
  Object.assign(meta, m.get('meta') || {});
  for (const [key, v] of m.get('outbox') || []) outbox.set(key, v);
  for (const [key, v] of m.get('conflicts') || []) conflicts.set(key, v);
  if (!meta.localOnlySince) meta.localOnlySince = Date.now();
  // Ask the browser not to evict our data under storage pressure (best effort).
  navigator.storage?.persist?.().catch(() => {});
  window.addEventListener('online', () => { status.online = true; emit(); sync(); });
  window.addEventListener('offline', () => { status.online = false; emit(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  setInterval(() => { if (!document.hidden) sync(); }, 60_000);
  if (IS_ARTIFACT) { meta.signedIn = false; connectCloud(); }
  else if (IS_LOCAL) { meta.signedIn = false; status.cloudChecked = true; }
  else {
    try {
      const s = await api('/api/session');
      meta.signedIn = s.signedIn;
    } catch { /* offline: keep the last known sign-in state */ }
  }
  status.ready = true;
  emit();
}

// ---- reading ----
export function all(col) {
  const out = [];
  for (const r of records.values()) if (r.col === col && !r.deleted) out.push({ ...r.data, id: r.id });
  return out;
}
export function get(col, id) {
  const r = records.get(k(col, id));
  return r && !r.deleted ? { ...r.data, id } : null;
}
/** Every id ever used in a collection, including deleted ones. */
export function idsIncludingDeleted(col) {
  const s = new Set();
  for (const r of records.values()) if (r.col === col) s.add(r.id);
  return s;
}
export const hasRecord = (col, id) => records.has(k(col, id));

// ---- writing ----
let syncTimer = null;
function scheduleSync() { clearTimeout(syncTimer); syncTimer = setTimeout(sync, 1200); }

/** Save a record. `gen` marks auto-generated data (defaults, routine days) that may yield to the server copy. */
export function put(col, id, data, { gen = false, force = false } = {}) {
  const key = k(col, id);
  const prev = records.get(key);
  const clean = clone(data);
  delete clean.id;
  clean.updatedAt = Date.now();
  // `gen` stays true only while nobody has edited an auto-created record.
  records.set(key, { col, id, rev: prev?.rev || 0, deleted: false, data: clean, lv: (prev?.lv || 0) + 1, gen: gen && (!prev || !!prev.gen) });
  const ob = outbox.get(key);
  outbox.set(key, { baseRev: ob ? ob.baseRev : prev?.rev || 0, gen: ob ? ob.gen && gen : gen, force: force || ob?.force || false });
  persist([key]);
  emit();
  scheduleSync();
}

export function remove(col, id, { force = false } = {}) {
  const key = k(col, id);
  const prev = records.get(key);
  if (!prev) return;
  records.set(key, { ...prev, deleted: true, data: null, lv: (prev.lv || 0) + 1 });
  const ob = outbox.get(key);
  outbox.set(key, { baseRev: ob ? ob.baseRev : prev.rev || 0, gen: false, force: force || ob?.force || false });
  persist([key]);
  emit();
  scheduleSync();
}

// ---- sync ----
const sameData = (a, b) => {
  const strip = (x) => { if (!x) return x; const { updatedAt, ...rest } = x; return JSON.stringify(rest); };
  return strip(a) === strip(b);
};

function acceptServer(key, s) {
  const prev = records.get(key);
  records.set(key, { col: s.col, id: s.id, rev: s.rev, deleted: s.deleted, data: s.data, lv: prev?.lv || 0 });
  outbox.delete(key);
  conflicts.delete(key);
}

function onServerCopy(key, s) {
  const ob = outbox.get(key);
  if (!ob) {
    const cur = records.get(key);
    if (cur && cur.rev === s.rev) return; // already have this version
    return acceptServer(key, s);
  }
  if (echo.get(key) === s.rev) return; // my own write arriving back
  if (s.rev <= ob.baseRev) return; // our own earlier write echoing back
  const local = records.get(key);
  if (ob.gen || (local && sameData(local.data, s.data) && !!local.deleted === !!s.deleted)) return acceptServer(key, s);
  if (ob.force) { ob.baseRev = s.rev; return; }
  conflicts.set(key, { server: s });
}

let syncPromise = null;
export function sync() {
  if (syncPromise) return syncPromise;
  if (!meta.signedIn || !navigator.onLine) { emit(); return Promise.resolve(); }
  status.syncing = true;
  emit();
  syncPromise = (async () => {
    // Yield first: if nothing below awaits, the finally block must still run
    // after syncPromise has been assigned, or it would never be cleared.
    await null;
    try {
      // 1. Pull newer copies from the server (the web-app edition gets them live instead).
      for (let more = !IS_ARTIFACT; more;) {
        const r = await api(`/api/sync?since=${meta.lastSeq}`);
        for (const s of r.records) onServerCopy(k(s.col, s.id), s);
        persist(r.records.map((s) => k(s.col, s.id)));
        meta.lastSeq = r.seq;
        more = r.more;
      }
      // 2. Push my pending changes (not ones waiting for a conflict decision).
      for (let round = 0; round < 3; round++) {
        const keys = [...outbox.keys()].filter((key) => !conflicts.has(key)).slice(0, 500);
        if (!keys.length) break;
        const snap = new Map(keys.map((key) => [key, records.get(key)?.lv]));
        const changes = keys.map((key) => {
          const r = records.get(key);
          return { col: r.col, id: r.id, baseRev: outbox.get(key).baseRev, deleted: !!r.deleted, data: r.deleted ? undefined : r.data };
        });
        changes.forEach((c) => echo.set(k(c.col, c.id), c.baseRev + 1));
        let results;
        try {
          results = IS_ARTIFACT ? await cloud.push(changes) : (await api('/api/sync', { method: 'POST', body: { changes } })).results;
        } finally { changes.forEach((c) => echo.delete(k(c.col, c.id))); }
        let retry = false;
        results.forEach((res, i) => {
          const key = keys[i];
          const rec = records.get(key);
          const ob = outbox.get(key);
          if (!rec || !ob) return;
          if (res.ok) {
            rec.rev = res.rev;
            if (rec.lv === snap.get(key)) outbox.delete(key); else ob.baseRev = res.rev;
          } else if (res.conflict) {
            const s = res.server || { col: rec.col, id: rec.id, rev: 0, deleted: true, data: null };
            if (ob.force) { ob.baseRev = s.rev; retry = true; } else onServerCopy(key, s);
          } else {
            meta.lastError = res.error || 'A change was rejected';
          }
        });
        persist(keys);
        if (!retry && outbox.size === 0) break;
      }
      meta.lastSyncAt = Date.now();
      meta.lastError = '';
    } catch (e) {
      if (e.status === 401) meta.signedIn = false;
      meta.lastError = e.status === 0 || e.code === 'unavailable' ? '' : e.message || 'Could not reach the cloud copy';
      if (e.code === 'revoked') meta.signedIn = false;
    } finally {
      status.syncing = false;
      syncPromise = null;
      persist();
      emit();
    }
  })();
  return syncPromise;
}

// ---- web-app edition: claude.ai account storage ----
async function connectCloud() {
  const ok = await cloud.connect();
  status.cloudChecked = true;
  meta.signedIn = ok;
  emit();
  if (!ok) { cloudFirst(false); return; }
  cloud.subscribe((recs, isFirst) => {
    for (const s of recs) onServerCopy(k(s.col, s.id), s);
    if (recs.length) persist(recs.map((s) => k(s.col, s.id)));
    meta.lastSyncAt = Date.now();
    emit();
    if (isFirst) { cloudFirst(true); sync(); }
  }, () => { meta.signedIn = false; emit(); cloudFirst(false); });
  setTimeout(() => cloudFirst(false), 8000);
}

// ---- conflicts ----
export function conflictList() {
  return [...conflicts].map(([key, c]) => ({ key, local: records.get(key), server: c.server }));
}
export function keepMine(key) {
  const c = conflicts.get(key);
  const ob = outbox.get(key);
  if (!c || !ob) return;
  ob.baseRev = c.server.rev;
  ob.gen = false;
  conflicts.delete(key);
  persist([key]);
  emit();
  sync();
}
export function keepTheirs(key) {
  const c = conflicts.get(key);
  if (!c) return;
  acceptServer(key, c.server);
  persist([key]);
  emit();
}

// ---- account ----
export async function signIn(password) {
  await api('/api/login', { method: 'POST', body: { password } });
  meta.signedIn = true;
  // Pull everything again so this device sees the whole cloud copy.
  meta.lastSeq = 0;
  persist();
  emit();
  await sync();
}
export async function signOut() {
  try { await api('/api/logout', { method: 'POST' }); } catch { /* offline */ }
  meta.signedIn = false;
  persist();
  emit();
}

export function syncState() {
  return {
    signedIn: meta.signedIn,
    deviceOnly: IS_LOCAL,
    cloudChecked: status.cloudChecked,
    online: status.online,
    syncing: status.syncing,
    pending: outbox.size,
    conflicts: conflicts.size,
    lastSyncAt: meta.lastSyncAt,
    lastError: meta.lastError,
  };
}

// ---- backup ----
export function exportData() {
  const out = [];
  for (const r of records.values()) if (!r.deleted) out.push({ col: r.col, id: r.id, data: r.data });
  return { app: 'my-day', version: 1, exportedAt: new Date().toISOString(), records: out };
}

export function validateBackup(obj) {
  if (!obj || obj.app !== 'my-day' || !Array.isArray(obj.records)) throw new Error('This file is not a My Day backup.');
  const cols = new Set(['tasks', 'series', 'reminders', 'config', 'content', 'money', 'office']);
  for (const r of obj.records) {
    if (!cols.has(r.col) || typeof r.id !== 'string' || typeof r.data !== 'object' || !r.data) throw new Error('The backup file is damaged or incomplete.');
  }
  const counts = {};
  for (const r of obj.records) counts[r.col] = (counts[r.col] || 0) + 1;
  return counts;
}

/**
 * mode 'merge': add records from the backup that are missing or older here.
 * mode 'replace': make this device (and the cloud) exactly match the backup.
 */
export async function restoreData(obj, mode) {
  validateBackup(obj);
  const incoming = new Map(obj.records.map((r) => [k(r.col, r.id), r]));
  let changed = 0;
  for (const [key, r] of incoming) {
    const cur = records.get(key);
    // Untouched defaults (e.g. the starting schedule) always yield to the backup.
    if (mode === 'merge' && cur && !cur.deleted && !cur.gen && (cur.data?.updatedAt || 0) >= (r.data.updatedAt || 0)) continue;
    if (cur && !cur.deleted && sameData(cur.data, r.data)) continue;
    const data = { ...r.data };
    put(r.col, r.id, data, { force: mode === 'replace' });
    // Keep the original timestamp so later merges compare correctly.
    records.get(key).data.updatedAt = r.data.updatedAt || Date.now();
    changed++;
  }
  if (mode === 'replace') {
    for (const [key, r] of [...records]) {
      if (!r.deleted && !incoming.has(key)) { remove(r.col, r.id, { force: true }); changed++; }
    }
  }
  persist([...incoming.keys()]);
  await flushWrites();
  emit();
  sync();
  return changed;
}
