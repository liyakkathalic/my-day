import { html, useState, useEffect } from '../../vendor/preact-htm.js';
import { useStore, openSheet, Field, Segmented, toast, Card, EmptyState, askConfirm } from '../ui.js';
import { SubHeader } from './more.js';
import * as M from '../model.js';
import * as store from '../store.js';
import { IS_ARTIFACT } from '../config.js';
import { pushSupport, enablePush, disablePush, serverStatus, sendTest } from '../push-client.js';
import { nextReminders, inQuietHours } from '../core/reminders.js';
import { fmtTime, weekdayName, zonedParts, relDate, isValidTime, isValidDate } from '../core/time.js';

function PushPanel() {
  useStore();
  const sync = store.syncState();
  const [sup, setSup] = useState(pushSupport());
  const [srv, setSrv] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const refresh = async () => {
    setSup(pushSupport());
    if (!sync.signedIn || !navigator.onLine || !pushSupport().supported) return setSrv(null);
    try { setSrv(await serverStatus()); } catch (e) { setSrv({ error: e.message }); }
  };
  useEffect(() => { refresh(); }, [sync.signedIn, sync.online]);

  const run = (fn) => async () => {
    setBusy(true); setMsg('');
    try { await fn(); } catch (e) { setMsg(e.message || 'Something went wrong.'); }
    setBusy(false);
    refresh();
  };
  const enable = run(async () => {
    const r = await enablePush();
    if (r === 'denied') setMsg('Notifications were not allowed. You can change this in iPhone Settings → Notifications → My Day.');
    else if (r === 'granted') setMsg('Notifications are on for this device.');
  });

  let state;
  if (!sup.secure) state = html`<p class="note">Notifications need a secure (https) address. Open My Day from its https web address.</p>`;
  else if (sup.ios && !sup.standalone) state = html`<p class="note">On iPhone, notifications only work in the Home Screen app. <a href="#more/install">Add My Day to your Home Screen</a>, open it from there, sign in, and come back to this page.</p>`;
  else if (!sup.supported) state = html`<p class="note">This browser does not support web notifications. On iPhone you need iOS 16.4 or later, using the Home Screen app.</p>`;
  else if (!sync.signedIn) state = html`<p class="note">Sign in first, so the server can send reminders while the app is closed. <a href="#more/sync">Sign in</a></p>`;
  else if (!sync.online) state = html`<p class="note">You are offline. Notification settings need an internet connection.</p>`;
  else if (sup.permission === 'denied') state = html`<p class="note">Notifications are turned off for My Day. To turn them on: iPhone Settings → Notifications → My Day → Allow Notifications. Then return here.</p>`;
  else if (sup.permission !== 'granted' || !srv?.thisDevice?.registered) {
    state = html`<p>Notifications are <strong>off</strong> on this device.</p>
      <button class="btn" onClick=${enable} disabled=${busy}>Enable Notifications</button>`;
  } else {
    const d = srv.thisDevice;
    state = html`<p>Notifications are <strong>on</strong> for this device.${srv.devices > 1 ? ` (${srv.devices} devices in total)` : ''}</p>
      ${d.lastError && html`<p class="note">The last attempt to reach this device failed (${d.lastError}). Try turning notifications off and on again.</p>`}
      ${d.lastDelivered && html`<p class="hint">Last handed to Apple’s push service: ${new Date(d.lastDelivered).toLocaleString('en-IN', { timeZone: M.tz() })}</p>`}
      <div class="action-grid">
        <button class="btn" disabled=${busy} onClick=${run(async () => { const r = await sendTest(0); setMsg(r.devices ? 'Test sent. It should arrive in a few seconds.' : 'No device accepted the test. Try enabling again.'); })}>Send test now</button>
        <button class="btn secondary" disabled=${busy} onClick=${run(async () => { await sendTest(120); setMsg('A test will be sent in about 2 minutes. Close the app now (swipe it away) to check it arrives while closed.'); })}>Test in 2 minutes (with app closed)</button>
        <button class="btn quiet" disabled=${busy} onClick=${run(async () => { await disablePush(); setMsg('Notifications turned off for this device.'); })}>Turn off on this device</button>
      </div>`;
  }
  return html`<${Card} title="Notifications on this device">
    ${state}
    ${msg && html`<p class="status-msg" role="status">${msg}</p>`}
    <p class="hint">Status: permission ${sup.permission === 'default' ? 'not asked yet' : sup.permission}${sup.standalone ? ' · Home Screen app' : ' · browser'}.</p>
    <p class="hint">Push notifications are best effort. Your phone and Apple decide when they are shown; Focus, Low Power Mode, no signal, or a server problem can delay or hide them. Do not rely on them as an alarm.</p>
  <//>`;
}

function ReminderEditor({ reminder, close }) {
  const isNew = !reminder;
  const [r, setR] = useState(() => reminder ? JSON.parse(JSON.stringify(reminder)) : { id: M.uid(), label: '', textKey: 'custom', enabled: true, schedule: { type: 'once', date: M.today(), time: '10:00' } });
  const setS = (patch) => setR((x) => ({ ...x, schedule: { ...x.schedule, ...patch } }));
  const s = r.schedule;
  const valid = r.label.trim() && isValidTime(s.time) && (s.type !== 'once' || isValidDate(s.date));
  const save = (e) => {
    e.preventDefault();
    if (!valid) return;
    store.put('reminders', r.id, { ...r, label: r.label.trim() });
    close();
    toast('Reminder saved');
  };
  const del = async () => { if (await askConfirm('Delete this reminder?', { ok: 'Delete' })) { store.remove('reminders', r.id); close(); } };
  return html`<form class="stack" onSubmit=${save}>
    <${Field} label="What is it for? (only shown inside the app)" id="rm-label"><input id="rm-label" data-autofocus=${isNew} value=${r.label} onInput=${(e) => setR({ ...r, label: e.currentTarget.value })} /><//>
    ${r.textKey === 'custom' && html`<div class="field"><span class="field-label">Repeats</span><${Segmented} label="Repeats" value=${s.type} onChange=${(v) => setS({ type: v, weekday: s.weekday ?? 1, date: s.date || M.today() })}
      options=${[['once', 'Once'], ['daily', 'Daily'], ['weekly', 'Weekly']]} /></div>`}
    ${s.type === 'once' && html`<${Field} label="Date" id="rm-date"><input id="rm-date" type="date" value=${s.date} onInput=${(e) => setS({ date: e.currentTarget.value })} /><//>`}
    ${s.type === 'weekly' && html`<${Field} label="Day" id="rm-wd"><select id="rm-wd" value=${String(s.weekday)} onChange=${(e) => setS({ weekday: Number(e.currentTarget.value) })}>
      ${[1, 2, 3, 4, 5, 6, 0].map((d) => html`<option value=${String(d)}>${weekdayName(d)}</option>`)}</select><//>`}
    <${Field} label="Time" id="rm-time" hint=${inQuietHours(s.time, M.settings()) ? `Inside quiet hours — it will arrive at ${fmtTime(M.settings().quietEnd)}.` : ''}>
      <input id="rm-time" type="time" value=${s.time} onInput=${(e) => setS({ time: e.currentTarget.value })} /><//>
    <p class="hint">The notification will only say “You have a reminder in My Day.”</p>
    <div class="sheet-actions">
      ${!isNew && r.textKey === 'custom' && html`<button type="button" class="btn quiet" onClick=${del}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!valid}>Save</button>
    </div>
  </form>`;
}

function WebAppNote() {
  return html`<${Card} title="Reminders in the web app">
    <p>While My Day is open, a reminder appears at the bottom of the screen when it is due.</p>
    <p class="note">This web-app version cannot send phone notifications when it is closed. For real iPhone reminders with the app closed, use the self-hosted version (it needs a small server — see the project’s DEPLOY guide). Your reminder settings below carry over.</p>
  <//>`;
}

const describe = (s) => s.type === 'daily' ? `Every day at ${fmtTime(s.time)}` : s.type === 'weekly' ? `${weekdayName(Number(s.weekday))}s at ${fmtTime(s.time)}` : `${relDate(s.date, M.today())} at ${fmtTime(s.time)}`;

export function NotificationsView() {
  useStore();
  const list = M.reminders().sort((a, b) => (a.textKey === 'custom') - (b.textKey === 'custom') || a.label.localeCompare(b.label));
  const settings = M.settings();
  const upcoming = nextReminders({ reminders: M.reminders(), tasks: M.tasks(), settings }, Date.now(), 7).slice(0, 8);
  const labelFor = (u) => u.key.startsWith('t:') ? (M.getTask(u.ref)?.title || 'Task') : (M.reminders().find((r) => r.id === u.ref)?.label || 'Reminder');
  return html`<div class="screen">
    <${SubHeader} title="Reminders" />
    ${IS_ARTIFACT ? html`<${WebAppNote} />` : html`<${PushPanel} />`}
    <${Card} title="Reminders" action=${html`<button class="link-btn" onClick=${() => openSheet('New reminder', ReminderEditor)}>+ Add</button>`}>
      <ul class="menu flat">${list.map((r) => html`<li key=${r.id}>
        <div class="toggle-row">
          <button class="toggle-text" onClick=${() => openSheet('Edit reminder', ReminderEditor, { reminder: r })}>
            <span class="menu-title">${r.label}</span><span class="menu-desc">${describe(r.schedule)}</span>
          </button>
          <label class="switch"><input type="checkbox" checked=${r.enabled !== false} aria-label=${`${r.label} reminder on`}
            onChange=${(e) => store.put('reminders', r.id, { ...r, enabled: e.currentTarget.checked })} /><span></span></label>
        </div>
      </li>`)}</ul>
      <p class="hint">Deadline reminders are set on each task (open a task → Edit → Reminder). Quiet hours: ${fmtTime(settings.quietStart)}–${fmtTime(settings.quietEnd)} · <a href="#more/settings">change</a></p>
    <//>
    <${Card} title="Coming up (next 7 days)">
      ${upcoming.length ? html`<ul class="plain">${upcoming.map((u) => {
        const p = zonedParts(new Date(u.fireAt), settings.tz);
        return html`<li key=${u.key}><strong>${relDate(p.date, M.today())}, ${fmtTime(String(p.hour).padStart(2, '0') + ':' + String(p.minute).padStart(2, '0'))}</strong> · ${labelFor(u)}${u.shifted ? ' (moved out of quiet hours)' : ''}</li>`;
      })}</ul>` : html`<${EmptyState}>No reminders in the next 7 days.<//>`}
      ${!IS_ARTIFACT && html`<p class="hint">Reminders are sent by the server only for data that has synced. Unsynced changes on this device are not yet known to the server.</p>`}
    <//>
  </div>`;
}
