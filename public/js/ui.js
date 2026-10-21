import { html, useState, useEffect, useRef, useReducer } from '../vendor/preact-htm.js';
import * as store from './store.js';
import * as M from './model.js';
import { CATEGORIES } from './core/defaults.js';
import { addDays, relDate, fmtDate, weekdayOf, daysBetween, fmtTime, isValidDate } from './core/time.js';
import { deadlineLabel } from './core/tasks.js';
import { inQuietHours } from './core/reminders.js';

export { html };

// ---------- store hook ----------
export function useStore() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => store.subscribe(force), []);
}

/** Re-render every 30 s so the current block stays correct. */
export function useClock() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    const vis = () => !document.hidden && setNow(Date.now());
    document.addEventListener('visibilitychange', vis);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return now;
}

// ---------- sheets (bottom panels) ----------
let sheets = [];
const sheetListeners = new Set();
const emitSheets = () => sheetListeners.forEach((f) => f());
export function openSheet(title, Comp, props = {}) {
  const id = Math.random().toString(36).slice(2);
  sheets = [...sheets, { id, title, Comp, props, opener: document.activeElement }];
  emitSheets();
  return id;
}
export function closeSheet(id) {
  const s = sheets.find((x) => x.id === id) || sheets[sheets.length - 1];
  sheets = sheets.filter((x) => x !== s);
  emitSheets();
  s?.opener?.focus?.({ preventScroll: true });
}
export const sheetOpen = () => sheets.length > 0;
export function closeAllSheets() { if (sheets.length) { sheets = []; emitSheets(); } }
addEventListener('hashchange', closeAllSheets);

export function SheetHost() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => { sheetListeners.add(force); return () => sheetListeners.delete(force); }, []);
  useEffect(() => {
    document.body.classList.toggle('sheet-open', sheets.length > 0);
    const onKey = (e) => { if (e.key === 'Escape' && sheets.length) closeSheet(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
  return sheets.map((s, i) => html`<${Sheet} key=${s.id} s=${s} top=${i === sheets.length - 1} />`);
}

function Sheet({ s, top }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current?.querySelector('[data-autofocus]') || ref.current?.querySelector('h2');
    el?.focus({ preventScroll: true });
  }, []);
  const close = () => closeSheet(s.id);
  return html`
    <div class="sheet-backdrop" onClick=${close} aria-hidden="true"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-label=${s.title} ref=${ref} inert=${!top}>
      <div class="sheet-head">
        <h2 tabindex="-1">${s.title}</h2>
        <button class="icon-btn" onClick=${close} aria-label="Close">✕</button>
      </div>
      <div class="sheet-body"><${s.Comp} ...${s.props} close=${close} /></div>
    </div>`;
}

// ---------- toasts ----------
let toastState = null;
const toastListeners = new Set();
export function toast(message, action) {
  toastState = { message, action, id: Date.now() };
  toastListeners.forEach((f) => f());
  const id = toastState.id;
  setTimeout(() => { if (toastState?.id === id) { toastState = null; toastListeners.forEach((f) => f()); } }, 5000);
}
export function ToastHost() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => { toastListeners.add(force); return () => toastListeners.delete(force); }, []);
  if (!toastState) return html`<div class="toast-region" aria-live="polite"></div>`;
  const t = toastState;
  return html`<div class="toast-region" aria-live="polite">
    <div class="toast"><span>${t.message}</span>
      ${t.action && html`<button class="link-btn" onClick=${() => { t.action.run(); toastState = null; toastListeners.forEach((f) => f()); }}>${t.action.label}</button>`}
    </div></div>`;
}

// ---------- basic pieces ----------
export function Field({ label, hint, children, id }) {
  return html`<label class="field" for=${id}><span class="field-label">${label}</span>${children}${hint && html`<span class="hint">${hint}</span>`}</label>`;
}

export function Segmented({ options, value, onChange, label }) {
  return html`<div class="segmented" role="tablist" aria-label=${label}>
    ${options.map(([v, text]) => html`<button type="button" role="tab" aria-selected=${v === value} class=${v === value ? 'on' : ''} onClick=${() => onChange(v)}>${text}</button>`)}
  </div>`;
}

export function Chips({ options, value, onChange, allowNone = true, label }) {
  return html`<div class="chips" role="group" aria-label=${label}>
    ${options.map(([v, text]) => html`<button type="button" class=${'chip' + (v === value ? ' on' : '')} aria-pressed=${v === value}
      onClick=${() => onChange(allowNone && v === value ? '' : v)}>${text}</button>`)}
  </div>`;
}

export const categoryOptions = () => CATEGORIES.map((c) => [c, c]);

export function EmptyState({ children }) {
  return html`<p class="empty">${children}</p>`;
}

export function Card({ title, action, children, cls = '' }) {
  return html`<section class=${'card ' + cls}>
    ${(title || action) && html`<div class="card-head">${title && html`<h2>${title}</h2>`}${action}</div>`}
    ${children}
  </section>`;
}

function nextWeekday(from, wd) {
  const diff = (wd - weekdayOf(from) + 7) % 7 || 7;
  return addDays(from, diff);
}

/** Native date input plus quick choices. */
export function DateQuick({ value, onChange, includeNone = true, label = 'Date', id }) {
  const t = M.today();
  const opts = [
    [t, 'Today'], [addDays(t, 1), 'Tomorrow'], [nextWeekday(t, 1), 'Next Monday'],
  ];
  if (weekdayOf(t) >= 1 && weekdayOf(t) <= 5) opts.push([nextWeekday(t, 6), 'Saturday']);
  return html`<div class="date-quick">
    <div class="chips" role="group" aria-label=${label}>
      ${opts.map(([v, txt]) => html`<button type="button" class=${'chip' + (value === v ? ' on' : '')} aria-pressed=${value === v} onClick=${() => onChange(v)}>${txt}</button>`)}
      ${includeNone && html`<button type="button" class=${'chip' + (!value ? ' on' : '')} aria-pressed=${!value} onClick=${() => onChange('')}>No date</button>`}
    </div>
    <input id=${id} type="date" value=${value || ''} onInput=${(e) => onChange(e.currentTarget.value)} aria-label=${label} />
  </div>`;
}

// ---------- task row ----------
export function taskMeta(t, today) {
  const bits = [];
  if (t.category) bits.push(t.category);
  if (t.status === 'waiting') {
    bits.push(`Waiting for ${t.waitingFor || 'someone'}`);
    if (t.followUpDate) bits.push(t.followUpDate <= today ? 'Follow up today' : `Follow up ${relDate(t.followUpDate, today)}`);
  } else if (t.plannedDate && t.plannedDate !== today) {
    bits.push(t.plannedDate < today ? `Planned ${relDate(t.plannedDate, today)}` : `Planned ${relDate(t.plannedDate, today)}`);
  }
  if (t.dueDate) bits.push(`${deadlineLabel(t.dueDate, today)} (${fmtDate(t.dueDate)})`);
  if (t.seriesId) bits.push('Routine');
  if (t.owner) bits.push(`Owner: ${t.owner}`);
  return bits;
}

export function TaskRow({ task: t, today, actions = false }) {
  const done = t.status === 'done';
  const toggle = () => {
    if (done) { M.reopenTask(t); return; }
    M.completeTask(t);
    toast('Marked as done', { label: 'Undo', run: () => M.saveTask(t) });
  };
  return html`<li class=${'task' + (done ? ' done' : '')}>
    <div class="task-main">
      <button class="check" onClick=${toggle} aria-label=${done ? `Mark “${t.title}” as not done` : `Mark “${t.title}” as done`} aria-pressed=${done}>
        <span aria-hidden="true">${done ? '✓' : ''}</span>
      </button>
      <button class="task-text" onClick=${() => openTaskActions(t)}>
        <span class="task-title">${t.title}</span>
        ${t.nextAction && html`<span class="task-next">Next: ${t.nextAction}</span>`}
        <span class="task-meta">${taskMeta(t, today).join(' · ')}</span>
      </button>
    </div>
    ${actions && !done && html`<div class="task-actions">
      <button class="btn small" onClick=${toggle}>Done</button>
      <button class="btn small secondary" onClick=${() => openSheet('Reschedule', RescheduleSheet, { task: t })}>Reschedule</button>
      <button class="btn small secondary" onClick=${() => openSheet('Waiting for someone', WaitingSheet, { task: t })}>Waiting</button>
    </div>`}
  </li>`;
}

export function TaskList({ items, today, actions, empty }) {
  if (!items.length) return html`<${EmptyState}>${empty}<//>`;
  return html`<ul class="task-list">${items.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} actions=${actions} />`)}</ul>`;
}

// ---------- task action sheet ----------
export function openTaskActions(t) {
  openSheet(t.title, TaskActions, { id: t.id });
}

function TaskActions({ id, close }) {
  useStore();
  const t = M.getTask(id);
  if (!t) return html`<p>This item was removed.</p>`;
  const today = M.today();
  const isPriority = t.priorityDate === today;
  const go = (fn, msg) => () => { fn(); close(); if (msg) toast(msg); };
  return html`<div class="stack">
    <p class="muted">${taskMeta(t, today).join(' · ') || 'No details yet'}</p>
    ${t.nextAction && html`<p><strong>Next action:</strong> ${t.nextAction}</p>`}
    ${t.notes && html`<p class="notes">${t.notes}</p>`}
    <div class="action-grid">
      ${t.status !== 'done' && html`<button class="btn" onClick=${go(() => M.completeTask(t), 'Marked as done')}>Done</button>`}
      ${t.status === 'done' && html`<button class="btn" onClick=${go(() => M.reopenTask(t), 'Moved back to open')}>Not done yet</button>`}
      <button class="btn secondary" onClick=${() => { close(); openSheet('Reschedule', RescheduleSheet, { task: t }); }}>Reschedule</button>
      ${t.status === 'waiting'
        ? html`<button class="btn secondary" onClick=${go(() => M.resumeTask(t), 'Back on today’s list')}>No longer waiting</button>`
        : html`<button class="btn secondary" onClick=${() => { close(); openSheet('Waiting for someone', WaitingSheet, { task: t }); }}>Waiting</button>`}
      ${t.status === 'open' && html`<button class="btn secondary" onClick=${() => {
        const ok = M.setPriority(t, !isPriority);
        close();
        toast(ok === false ? 'You already have three priorities today.' : isPriority ? 'Removed from priorities' : 'Added to today’s priorities');
      }}>${isPriority ? 'Remove from priorities' : 'Make a priority'}</button>`}
      ${t.status !== 'later' && t.status !== 'done' && !t.seriesId && html`<button class="btn secondary" onClick=${go(() => M.laterTask(t), 'Moved to Later')}>Later</button>`}
      <button class="btn secondary" onClick=${() => { close(); openSheet('Edit', TaskEditor, { task: t }); }}>Edit</button>
    </div>
  </div>`;
}

// ---------- reschedule ----------
export function RescheduleSheet({ task, close }) {
  const [date, setDate] = useState(task.plannedDate && task.plannedDate > M.today() ? task.plannedDate : addDays(M.today(), 1));
  const save = () => {
    if (!isValidDate(date)) return;
    M.rescheduleTask(M.getTask(task.id) || task, date);
    close();
    toast(`Moved to ${relDate(date, M.today())}`);
  };
  return html`<div class="stack">
    ${task.seriesId && html`<p class="note">This moves only this day of the routine. Other days stay as they are.</p>`}
    ${task.dueDate && html`<p class="note">The real deadline stays ${fmtDate(task.dueDate)}. Only the planned date changes.</p>`}
    <${Field} label="New planned date" id="resched-date"><${DateQuick} id="resched-date" value=${date} onChange=${setDate} includeNone=${false} label="New planned date" /><//>
    <div class="sheet-actions"><button class="btn" onClick=${save} disabled=${!isValidDate(date)}>Move</button></div>
  </div>`;
}

// ---------- waiting ----------
export function WaitingSheet({ task, close }) {
  const t0 = M.today();
  const [who, setWho] = useState(task.waitingFor || task.owner || '');
  const [last, setLast] = useState(task.lastContact || t0);
  const [follow, setFollow] = useState(task.followUpDate && task.followUpDate > t0 ? task.followUpDate : addDays(t0, 3));
  const save = () => {
    M.waitTask(M.getTask(task.id) || task, { waitingFor: who.trim(), lastContact: last, followUpDate: follow });
    close();
    toast(`Waiting. It will come back on ${relDate(follow, t0)}.`);
  };
  return html`<form class="stack" onSubmit=${(e) => { e.preventDefault(); save(); }}>
    <${Field} label="Who am I waiting for?" id="w-who"><input id="w-who" data-autofocus value=${who} onInput=${(e) => setWho(e.currentTarget.value)} autocomplete="off" /><//>
    <${Field} label="Last contact" id="w-last"><input id="w-last" type="date" value=${last} onInput=${(e) => setLast(e.currentTarget.value)} /><//>
    <${Field} label="Follow up on" id="w-follow" hint="Until then, this stays quietly in the Waiting list."><${DateQuick} id="w-follow" value=${follow} onChange=${setFollow} includeNone=${false} label="Follow-up date" /><//>
    <div class="sheet-actions"><button class="btn" type="submit" disabled=${!isValidDate(follow)}>Save</button></div>
  </form>`;
}

// ---------- quick capture ----------
export function QuickCapture({ close }) {
  const t0 = M.today();
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('today');
  const [category, setCategory] = useState('');
  const save = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const plannedDate = when === 'today' ? t0 : when === 'tomorrow' ? addDays(t0, 1) : '';
    M.createTask({ title: title.trim(), category, plannedDate, status: when === 'later' ? 'later' : 'open' });
    close();
    toast('Captured');
  };
  return html`<form class="stack" onSubmit=${save}>
    <${Field} label="What’s on your mind?" id="qc-title">
      <input id="qc-title" data-autofocus value=${title} onInput=${(e) => setTitle(e.currentTarget.value)} autocomplete="off" enterkeyhint="done" placeholder="e.g. Call the bank about the statement" />
    <//>
    <${Segmented} label="When" value=${when} onChange=${setWhen} options=${[['today', 'Today'], ['tomorrow', 'Tomorrow'], ['later', 'Later']]} />
    <${Chips} label="Category" options=${categoryOptions()} value=${category} onChange=${setCategory} />
    <div class="sheet-actions"><button class="btn" type="submit" disabled=${!title.trim()}>Save</button></div>
  </form>`;
}

// ---------- full task editor ----------
const REM_ANCHORS = [['', 'No reminder'], ['planned', 'On the planned date'], ['due', 'Before the deadline'], ['fixed', 'On a specific date']];

export function TaskEditor({ task, close, defaults = {} }) {
  const isNew = !task;
  const [t, setT] = useState(() => task ? { ...task } : { title: '', status: 'open', plannedDate: M.today(), ...defaults });
  const set = (k) => (v) => setT((x) => ({ ...x, [k]: v }));
  const inp = (k) => (e) => set(k)(e.currentTarget.value);
  const rem = t.reminder || null;
  const setRem = (patch) => setT((x) => ({ ...x, reminder: patch === null ? null : { anchor: 'planned', daysBefore: 0, time: '09:00', ...(x.reminder || {}), ...patch } }));
  const qs = M.settings();

  const save = (e) => {
    e.preventDefault();
    if (!t.title.trim()) return;
    const data = { ...t, title: t.title.trim() };
    if (data.reminder && !data.reminder.anchor) data.reminder = null;
    if (isNew) M.createTask(data); else M.saveTask(data);
    close();
    toast(isNew ? 'Task added' : 'Saved');
  };
  const del = () => {
    if (!confirm(t.seriesId ? 'Skip this day of the routine?' : 'Delete this task? This cannot be undone.')) return;
    M.deleteTask(task);
    close();
    toast(t.seriesId ? 'Skipped for this day' : 'Deleted');
  };
  const remInQuiet = rem?.time && inQuietHours(rem.time, qs);

  return html`<form class="stack" onSubmit=${save}>
    ${t.seriesId && html`<p class="note">Changes here apply to this day only. To change every day, edit the routine in More → Routines.</p>`}
    <${Field} label="Title" id="te-title"><input id="te-title" data-autofocus=${isNew} value=${t.title} onInput=${inp('title')} required autocomplete="off" /><//>
    <${Field} label="Next action" id="te-next" hint="The very next physical step."><input id="te-next" value=${t.nextAction || ''} onInput=${inp('nextAction')} autocomplete="off" /><//>
    <div class="field"><span class="field-label">Category</span><${Chips} label="Category" options=${categoryOptions()} value=${t.category || ''} onChange=${set('category')} /></div>
    <${Field} label="Status" id="te-status">
      <select id="te-status" value=${t.status} onChange=${inp('status')}>
        <option value="open">To do</option><option value="waiting">Waiting for someone</option><option value="later">Later</option><option value="done">Done</option>
      </select>
    <//>
    <${Field} label="Planned date" id="te-planned" hint="When I intend to work on it. Not a deadline."><${DateQuick} id="te-planned" value=${t.plannedDate || ''} onChange=${set('plannedDate')} label="Planned date" /><//>
    <${Field} label="Real deadline (optional)" id="te-due" hint="Only for confirmed deadlines."><input id="te-due" type="date" value=${t.dueDate || ''} onInput=${inp('dueDate')} /><//>
    <${Field} label="Owner (optional)" id="te-owner" hint="Who is responsible. No message is sent."><input id="te-owner" value=${t.owner || ''} onInput=${inp('owner')} autocomplete="off" /><//>
    ${t.status === 'waiting' && html`
      <${Field} label="Waiting for" id="te-wf"><input id="te-wf" value=${t.waitingFor || ''} onInput=${inp('waitingFor')} autocomplete="off" /><//>
      <${Field} label="Last contact" id="te-lc"><input id="te-lc" type="date" value=${t.lastContact || ''} onInput=${inp('lastContact')} /><//>`}
    <${Field} label="Follow-up date" id="te-fu"><input id="te-fu" type="date" value=${t.followUpDate || ''} onInput=${inp('followUpDate')} /><//>
    <${Field} label="Notes" id="te-notes"><textarea id="te-notes" rows="3" value=${t.notes || ''} onInput=${inp('notes')}></textarea><//>
    <fieldset class="field">
      <legend class="field-label">Reminder</legend>
      <select aria-label="Reminder" value=${rem?.anchor || ''} onChange=${(e) => setRem(e.currentTarget.value ? { anchor: e.currentTarget.value } : null)}>
        ${REM_ANCHORS.map(([v, l]) => html`<option value=${v}>${l}</option>`)}
        <option value="followup">On the follow-up date</option>
      </select>
      ${rem && html`<div class="row">
        ${rem.anchor === 'due' && html`<label class="inline">Days before <select value=${String(rem.daysBefore || 0)} onChange=${(e) => setRem({ daysBefore: Number(e.currentTarget.value) })}>
          ${[0, 1, 2, 3, 7].map((d) => html`<option value=${String(d)}>${d === 0 ? 'Same day' : d}</option>`)}</select></label>`}
        ${rem.anchor === 'fixed' && html`<input type="date" aria-label="Reminder date" value=${rem.date || ''} onInput=${(e) => setRem({ date: e.currentTarget.value })} />`}
        <input type="time" aria-label="Reminder time" value=${rem.time || '09:00'} onInput=${(e) => setRem({ time: e.currentTarget.value })} />
      </div>
      <span class="hint">${remInQuiet ? `This is inside quiet hours, so it will arrive at ${fmtTime(qs.quietEnd)}.` : 'The notification will only say “You have a reminder in My Day.”'}</span>`}
    </fieldset>
    <div class="sheet-actions">
      ${!isNew && html`<button type="button" class="btn quiet" onClick=${del}>${t.seriesId ? 'Skip this day' : 'Delete'}</button>`}
      <button class="btn" type="submit" disabled=${!t.title.trim()}>${isNew ? 'Add task' : 'Save'}</button>
    </div>
  </form>`;
}

export function syncLabel(s) {
  if (!s.signedIn) return { text: 'On this device only', tone: 'neutral' };
  if (s.conflicts) return { text: `${s.conflicts} to review`, tone: 'attn' };
  if (!s.online) return { text: s.pending ? `Offline · ${s.pending} not synced` : 'Offline', tone: 'neutral' };
  if (s.syncing) return { text: 'Syncing…', tone: 'neutral' };
  if (s.pending) return { text: `${s.pending} not synced yet`, tone: 'attn' };
  if (s.lastError) return { text: 'Sync problem', tone: 'attn' };
  return { text: 'Saved', tone: 'ok' };
}

export function SyncPill() {
  useStore();
  const s = store.syncState();
  const l = syncLabel(s);
  return html`<a class=${'pill ' + l.tone} href="#more/sync" aria-label=${'Sync status: ' + l.text}>${l.text}</a>`;
}

export function daysAgoLabel(date, today) {
  const d = daysBetween(date, today);
  return d === 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`;
}
