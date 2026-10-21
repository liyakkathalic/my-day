// Cloud copy for the claude.ai web-app edition. Records live in this person's
// private subtree of the artifact database (data/users/<id>/…), which nobody
// else, including other viewers of the link, can read. Each document carries a
// revision so the same "never silently overwrite newer data" rule applies.

let db = null;
let col = null;

export async function connect() {
  const c = window.claude;
  if (!c?.use) return false;
  try {
    const [d, u] = await Promise.all([c.use('db'), c.use('user')]);
    if (!d || !u) return false;
    const uid = await u.id();
    if (!uid) return false;
    db = d;
    col = db.collection(`data/users/${uid}`);
    return true;
  } catch {
    return false;
  }
}

const docKey = (c, id) => `${c}~${id}`;
const toRecord = (b) => ({ col: b.col, id: b.id, rev: b.rev || 0, deleted: !!b.deleted, data: b.deleted ? null : b.data ?? null });

/** Live updates for every record. Calls onRecords(records, isFirst) with changed records. */
export function subscribe(onRecords, onError) {
  let first = true;
  return col.onSnapshot((snap) => {
    const recs = [];
    for (const ch of snap.docChanges()) {
      if (ch.type === 'removed') continue;
      const body = ch.doc.data();
      if (body?.col && body?.id) recs.push(toRecord(body));
    }
    const isFirst = first && !snap.metadata.fromCache;
    if (isFirst) first = false;
    onRecords(recs, isFirst);
  }, onError);
}

async function withRetry(fn) {
  try { return await fn(); } catch (e) {
    if (e?.code !== 'unavailable') throw e;
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));
    return fn();
  }
}

/** Same result shape as the self-hosted server's POST /api/sync. */
export async function push(changes) {
  const results = [];
  for (const c of changes) {
    let ref;
    try { ref = col.doc(docKey(c.col, c.id)); } catch { results.push({ col: c.col, id: c.id, ok: false, error: 'Invalid item id' }); continue; }
    const cur = await withRetry(() => ref.get());
    const body = cur.exists ? cur.data() : null;
    const rev = body?.rev || 0;
    if (rev !== c.baseRev) {
      results.push({ col: c.col, id: c.id, ok: false, conflict: true, server: body ? toRecord(body) : null });
      continue;
    }
    try {
      await withRetry(() => ref.set({ col: c.col, id: c.id, rev: rev + 1, deleted: !!c.deleted, data: c.deleted ? null : c.data, at: Date.now() }));
      results.push({ col: c.col, id: c.id, ok: true, rev: rev + 1 });
    } catch (e) {
      if (e?.code === 'quota_exceeded') throw Object.assign(new Error('Your cloud storage is full. Delete old completed items or money entries, then try again.'), { status: 507 });
      if (e?.code === 'invalid_argument') { results.push({ col: c.col, id: c.id, ok: false, error: 'This item could not be saved to the cloud.' }); continue; }
      throw e;
    }
  }
  return results;
}
