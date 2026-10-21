// Daily copy of the database on the server, so the browser is never the only backup.
import fs from 'node:fs';
import path from 'node:path';
import { db, DATA_DIR } from './db.js';

const DIR = path.join(DATA_DIR, 'backups');
const KEEP = Number(process.env.BACKUP_KEEP_DAYS || 14);

export function backupNow() {
  fs.mkdirSync(DIR, { recursive: true, mode: 0o700 });
  const name = `myday-${new Date().toISOString().slice(0, 10)}.sqlite`;
  const file = path.join(DIR, name);
  if (fs.existsSync(file)) return null;
  db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
  const old = fs.readdirSync(DIR).filter((f) => /^myday-.*\.sqlite$/.test(f)).sort().slice(0, -KEEP);
  for (const f of old) fs.unlinkSync(path.join(DIR, f));
  console.log(`backup: wrote ${name}`);
  return file;
}

export function startBackups() {
  const run = () => { try { backupNow(); } catch (e) { console.error('backup failed:', e.message); } };
  run();
  return setInterval(run, 6 * 3600_000).unref();
}
