// Record-level sync with optimistic concurrency. Every record has a revision
// number. A client change is accepted only if it was based on the revision the
// server currently has; otherwise the server returns its newer copy as a
// conflict and nothing is overwritten.
import { db, tx, getMeta, setMeta } from './db.js';

export const COLLECTIONS = new Set(['tasks', 'series', 'reminders', 'config', 'content', 'money', 'office']);
const MAX_RECORD_BYTES = 256 * 1024;

const rowOut = (r) => r && {
  col: r.col, id: r.id, rev: r.rev, seq: r.seq, deleted: !!r.deleted,
  data: r.data ? JSON.parse(r.data) : null, updatedAt: r.updated_at,
};

const getRow = db.prepare('SELECT * FROM records WHERE col = ? AND id = ?');
const upsert = db.prepare(`INSERT INTO records (col, id, rev, seq, deleted, data, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(col, id) DO UPDATE SET rev = excluded.rev, seq = excluded.seq, deleted = excluded.deleted,
  data = excluded.data, updated_at = excluded.updated_at`);

function nextSeq() {
  const s = Number(getMeta('seq') || 0) + 1;
  setMeta('seq', s);
  return s;
}

export function validateChange(c) {
  if (!c || typeof c !== 'object') return 'Invalid change';
  if (!COLLECTIONS.has(c.col)) return 'Unknown collection';
  if (typeof c.id !== 'string' || !c.id || c.id.length > 200) return 'Invalid id';
  if (!Number.isInteger(c.baseRev) || c.baseRev < 0) return 'Invalid baseRev';
  if (!c.deleted && (typeof c.data !== 'object' || c.data === null || Array.isArray(c.data))) return 'Invalid data';
  if (c.data && JSON.stringify(c.data).length > MAX_RECORD_BYTES) return 'Record too large';
  return null;
}

export function applyChanges(changes) {
  return tx(() => changes.map((c) => {
    const err = validateChange(c);
    if (err) return { col: c?.col, id: c?.id, ok: false, error: err };
    const row = getRow.get(c.col, c.id);
    const current = row?.rev ?? 0;
    if (current !== c.baseRev) return { col: c.col, id: c.id, ok: false, conflict: true, server: rowOut(row) };
    const seq = nextSeq();
    const rev = current + 1;
    const now = Date.now();
    upsert.run(c.col, c.id, rev, seq, c.deleted ? 1 : 0, c.deleted ? null : JSON.stringify(c.data), now);
    return { col: c.col, id: c.id, ok: true, rev, seq };
  }));
}

export function changesSince(since, limit = 2000) {
  const rows = db.prepare('SELECT * FROM records WHERE seq > ? ORDER BY seq LIMIT ?').all(since, limit);
  return {
    records: rows.map(rowOut),
    seq: rows.length ? rows[rows.length - 1].seq : Math.max(since, Number(getMeta('seq') || 0)),
    more: rows.length === limit,
  };
}

/** Live (non-deleted) data of one collection, for the scheduler. */
export function liveData(col) {
  return db.prepare('SELECT id, data FROM records WHERE col = ? AND deleted = 0').all(col)
    .map((r) => ({ ...JSON.parse(r.data), id: r.id }));
}

export function exportAll() {
  return db.prepare('SELECT * FROM records WHERE deleted = 0 ORDER BY col, id').all().map(rowOut);
}
