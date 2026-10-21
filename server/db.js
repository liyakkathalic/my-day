import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export const DATA_DIR = path.resolve(process.env.DATA_DIR || './data');
fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });

export const db = new DatabaseSync(path.join(DATA_DIR, 'myday.sqlite'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS records (
    col TEXT NOT NULL, id TEXT NOT NULL, rev INTEGER NOT NULL, seq INTEGER NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0, data TEXT, updated_at INTEGER NOT NULL,
    PRIMARY KEY (col, id)
  );
  CREATE INDEX IF NOT EXISTS records_seq ON records(seq);
  CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT);
  CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, created INTEGER, expires INTEGER);
  CREATE TABLE IF NOT EXISTS push_subs (
    endpoint TEXT PRIMARY KEY, p256dh TEXT NOT NULL, auth TEXT NOT NULL, label TEXT,
    created INTEGER, last_ok INTEGER, last_error TEXT
  );
  CREATE TABLE IF NOT EXISTS sent_log (key TEXT PRIMARY KEY, fire_at INTEGER, sent_at INTEGER, devices INTEGER);
  CREATE TABLE IF NOT EXISTS test_jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, fire_at INTEGER NOT NULL, done INTEGER NOT NULL DEFAULT 0);
`);

export function getMeta(k) {
  return db.prepare('SELECT v FROM meta WHERE k = ?').get(k)?.v ?? null;
}
export function setMeta(k, v) {
  db.prepare('INSERT INTO meta (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v').run(k, String(v));
}

export function tx(fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const r = fn();
    db.exec('COMMIT');
    return r;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}
