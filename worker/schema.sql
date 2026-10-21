-- My Day on Cloudflare D1. Same record model as the self-hosted server
-- (server/db.js): one row per record, a revision per record for conflict
-- checks, and a global sequence number that devices sync from.
CREATE TABLE IF NOT EXISTS records (
  col TEXT NOT NULL, id TEXT NOT NULL, rev INTEGER NOT NULL, seq INTEGER NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0, data TEXT, updated_at INTEGER NOT NULL,
  PRIMARY KEY (col, id)
);
CREATE INDEX IF NOT EXISTS records_seq ON records(seq);
-- k = 'seq' (last sequence number), 'password' (PBKDF2 hash), 'setup_code' (SHA-256 of the one-time code)
CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT);
INSERT OR IGNORE INTO meta (k, v) VALUES ('seq', '0');
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, created INTEGER, expires INTEGER);
-- Failed sign-in attempts (hashed IP), for lockout. Rows older than a day are removed.
CREATE TABLE IF NOT EXISTS login_fails (ip_hash TEXT NOT NULL, at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS login_fails_ip ON login_fails(ip_hash, at);
