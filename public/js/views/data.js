import { html, useState } from '../../vendor/preact-htm.js';
import { useStore, Card, Field, toast, syncLabel, askConfirm } from '../ui.js';
import { IS_ARTIFACT } from '../config.js';
import { SubHeader } from './more.js';
import * as store from '../store.js';
import { api } from '../api.js';
import * as M from '../model.js';
import { isIOS, isStandalone, repairSubscription } from '../push-client.js';

const when = (ms) => (ms ? new Date(ms).toLocaleString('en-IN', { timeZone: M.tz(), dateStyle: 'medium', timeStyle: 'short' }) : 'never');
const COL_LABEL = { tasks: 'Tasks', series: 'Routines', reminders: 'Reminders', config: 'Settings', content: 'Content', money: 'Money', office: 'Office check notes' };

function describeRecord(r) {
  if (!r || r.deleted || !r.data) return 'Deleted';
  const d = r.data;
  return `${d.title || d.label || COL_LABEL[r.col] || r.id} · changed ${when(d.updatedAt)}`;
}

function Conflicts() {
  const list = store.conflictList();
  if (!list.length) return null;
  return html`<${Card} title="Changed on another device" cls="attn">
    <p>These items were changed both here and on another device. Choose which version to keep. Nothing is overwritten until you choose.</p>
    <ul class="plain">${list.map((c) => html`<li key=${c.key} class="conflict">
      <p><strong>${COL_LABEL[c.local?.col] || ''}</strong></p>
      <p>This device: ${describeRecord(c.local)}</p>
      <p>Other device: ${describeRecord(c.server)}</p>
      <div class="row">
        <button class="btn small" onClick=${() => store.keepMine(c.key)}>Keep this device’s</button>
        <button class="btn small secondary" onClick=${() => store.keepTheirs(c.key)}>Keep the other one</button>
      </div>
    </li>`)}</ul>
  <//>`;
}

function CloudView() {
  useStore();
  const s = store.syncState();
  const l = syncLabel(s);
  return html`<div class="screen">
    <${SubHeader} title="Cloud copy" />
    <${Conflicts} />
    <${Card} title="Status">
      <p><span class=${'pill ' + l.tone}>${l.text}</span></p>
      ${s.signedIn
        ? html`<p>Everything is saved to your claude.ai account, in a private area only you can read — even if you share this link. Open the same link on another device while signed in to see the same data.</p>`
        : s.cloudChecked
          ? html`<p class="note">The cloud copy is not available right now (signed out, or no connection). Your changes are kept on this device and will be saved to the cloud when it is available again.</p>`
          : html`<p>Connecting to your account…</p>`}
      <ul class="plain">
        <li>Connection: ${s.online ? 'online' : 'offline'}</li>
        <li>Changes waiting to be saved to the cloud: ${s.pending}</li>
        <li>Last update from the cloud: ${when(s.lastSyncAt)}</li>
        ${s.lastError && html`<li>Problem: ${s.lastError}</li>`}
      </ul>
      ${s.signedIn && s.pending > 0 && html`<div class="row"><button class="btn secondary" onClick=${() => store.sync()} disabled=${s.syncing || !s.online}>Save now</button></div>`}
    <//>
  </div>`;
}

export function SyncView() {
  if (IS_ARTIFACT) return html`<${CloudView} />`;
  useStore();
  const s = store.syncState();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const signIn = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try { await store.signIn(pw); setPw(''); toast('Signed in. Your data is syncing.'); repairSubscription(); } catch (x) { setErr(x.message); }
    setBusy(false);
  };
  const l = syncLabel(s);
  return html`<div class="screen">
    <${SubHeader} title="Sign-in and sync" />
    <${Conflicts} />
    <${Card} title="Status">
      <p><span class=${'pill ' + l.tone}>${l.text}</span></p>
      <ul class="plain">
        <li>Connection: ${s.online ? 'online' : 'offline'}</li>
        <li>Changes waiting to sync: ${s.pending}</li>
        <li>Last successful sync: ${when(s.lastSyncAt)}</li>
        ${s.lastError && html`<li>Problem: ${s.lastError}</li>`}
      </ul>
      ${s.signedIn && html`<div class="row"><button class="btn secondary" onClick=${() => store.sync()} disabled=${s.syncing || !s.online}>Sync now</button></div>`}
      ${!s.online && s.pending > 0 && html`<p class="hint">Your changes are saved on this device and will sync when you are back online.</p>`}
    <//>
    ${s.signedIn ? html`<${Card} title="Account">
        <p>You are signed in. Your data is backed up to your server.</p>
        <button class="btn quiet" onClick=${async () => { if (s.pending && !(await askConfirm(`${s.pending} changes have not synced yet. They stay on this device, but will not reach the server until you sign in again. Sign out anyway?`, { ok: 'Sign out' }))) return; await store.signOut(); toast('Signed out'); }}>Sign out</button>
      <//>`
      : html`<${Card} title="Sign in">
        <p>Sign in to back up your data and use it on more than one device. Until then, everything is saved on this device only.</p>
        ${isIOS() && !isStandalone() && html`<p class="note">On iPhone, Safari and the Home Screen app keep separate storage. If you plan to use the Home Screen app, sign in there.</p>`}
        <form class="stack" onSubmit=${signIn}>
          <${Field} label="Password" id="si-pw"><input id="si-pw" type="password" autocomplete="current-password" value=${pw} onInput=${(e) => setPw(e.currentTarget.value)} /><//>
          ${err && html`<p class="status-msg" role="alert">${err}</p>`}
          <button class="btn" type="submit" disabled=${busy || !pw || !s.online}>${s.online ? 'Sign in' : 'Offline — cannot sign in'}</button>
        </form>
      <//>`}
  </div>`;
}

async function saveFile(name, obj) {
  if (IS_ARTIFACT) {
    // Web-app edition: the page may only offer files through the platform's save prompt.
    const downloads = await window.claude?.use?.('downloads');
    if (!downloads) throw new Error('Saving files is not available here. Use “Copy backup” instead.');
    try { await downloads.save({ filename: name, data: JSON.stringify(obj, null, 2) }); return true; }
    catch (e) {
      if (e?.code === 'declined') return false;
      throw new Error(e?.code === 'rate_limited' ? 'A save prompt is already open. Please try again in a moment.' : 'The file could not be saved here. Use “Copy backup” instead.');
    }
  }
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const file = new File([blob], name, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return true; } catch (e) { if (e.name === 'AbortError') return false; }
  }
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return true;
}

const lastExportKey = 'myday-last-export';
const readLast = () => { try { return Number(localStorage.getItem(lastExportKey)) || 0; } catch { return 0; } };

export function DataView() {
  useStore();
  const s = store.syncState();
  const [backup, setBackup] = useState(null);
  const [counts, setCounts] = useState(null);
  const [err, setErr] = useState('');
  const [expErr, setExpErr] = useState('');
  const [last, setLast] = useState(readLast());
  const markExported = () => { try { localStorage.setItem(lastExportKey, String(Date.now())); } catch {} setLast(Date.now()); };
  const exportNow = async () => {
    setExpErr('');
    try {
      if (await saveFile(`myday-backup-${M.today()}.json`, store.exportData())) { markExported(); toast('Backup file saved'); }
    } catch (e) { setExpErr(e.message); }
  };
  const copyBackup = async () => {
    setExpErr('');
    try { await navigator.clipboard.writeText(JSON.stringify(store.exportData())); markExported(); toast('Backup copied. Paste it into a note or file to keep it.'); }
    catch { setExpErr('Copying is not allowed here. Use “Save a backup file”.'); }
  };
  const exportCloud = async () => {
    try { await saveFile(`myday-cloud-${M.today()}.json`, await api('/api/export')); } catch (e) { setExpErr(e.message); }
  };
  const pick = async (e) => {
    setErr(''); setBackup(null); setCounts(null);
    const f = e.currentTarget.files?.[0];
    if (!f) return;
    try {
      const obj = JSON.parse(await f.text());
      setCounts(store.validateBackup(obj));
      setBackup(obj);
    } catch (x) { setErr(x instanceof SyntaxError ? 'This file could not be read as a backup.' : x.message); }
  };
  const restore = async (mode) => {
    if (mode === 'replace' && !(await askConfirm('Replace everything with this backup? Items not in the backup will be removed from this device' + (s.signedIn ? ' and from the cloud.' : '.'), { ok: 'Replace everything' }))) return;
    const n = await store.restoreData(backup, mode);
    M.materializeRoutines();
    setBackup(null); setCounts(null);
    toast(`Restore complete: ${n} item${n === 1 ? '' : 's'} updated`);
  };
  return html`<div class="screen">
    <${SubHeader} title="Backup and restore" />
    <${Card} title="Where your data is kept">
      <ul class="plain">
        <li>On this device (works offline).</li>
        <li>${IS_ARTIFACT
          ? (s.signedIn ? 'In your claude.ai account (private to you), saved automatically.' : 'Not in the cloud right now — it will be saved when your account is reachable.')
          : (s.signedIn ? 'On your server, synced automatically. The server also keeps a daily copy for 14 days.' : 'Not on a server yet — sign in to add a cloud copy.')}</li>
        <li>In backup files you export (recommended once a week; keep them in iCloud Drive or Files).</li>
      </ul>
    <//>
    <${Card} title="Export">
      <p class="hint">Last backup file from this device: ${last ? when(last) : 'none yet'}</p>
      <div class="action-grid">
        <button class="btn" onClick=${exportNow}>Save a backup file</button>
        ${IS_ARTIFACT && html`<button class="btn secondary" onClick=${copyBackup}>Copy backup</button>`}
        ${!IS_ARTIFACT && s.signedIn && s.online && html`<button class="btn secondary" onClick=${exportCloud}>Download the cloud copy</button>`}
      </div>
      ${expErr && html`<p class="status-msg" role="alert">${expErr}</p>`}
    <//>
    <${Card} title="Restore">
      <label class="btn secondary file-btn">Choose a backup file<input type="file" accept="application/json,.json" onChange=${pick} /></label>
      ${err && html`<p class="status-msg" role="alert">${err}</p>`}
      ${counts && html`<div class="stack">
        <p>This backup contains: ${Object.entries(counts).map(([c, n]) => `${n} ${COL_LABEL[c] || c}`).join(', ')}. Exported ${backup.exportedAt ? new Date(backup.exportedAt).toLocaleString('en-IN', { timeZone: M.tz() }) : ''}.</p>
        <button class="btn" onClick=${() => restore('merge')}>Add missing and newer items</button>
        <button class="btn quiet" onClick=${() => restore('replace')}>Replace everything with this backup</button>
      </div>`}
    <//>
  </div>`;
}
