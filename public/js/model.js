// App-level helpers on top of the store: defaults, settings, tasks, routines.
import * as store from './store.js';
import { todayStr, addDays } from './core/time.js';
import { defaultSchedule, defaultSettings, defaultOfficeTemplate, defaultReminders } from './core/defaults.js';
import { materializeOccurrences, applySeriesEdit } from './core/recurrence.js';
import { markDone, reopen, reschedule, markWaiting } from './core/tasks.js';

export function uid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export const settings = () => ({ ...defaultSettings(), ...(store.get('config', 'settings') || {}) });
export const tz = () => settings().tz;
export const today = () => todayStr(tz());
export const schedule = () => store.get('config', 'schedule') || defaultSchedule();
export const officeTemplate = () => store.get('config', 'office') || defaultOfficeTemplate();

export const saveSettings = (s) => store.put('config', 'settings', s);
export const saveSchedule = (s) => store.put('config', 'schedule', s);
export const saveOfficeTemplate = (t) => store.put('config', 'office', t);

/** First launch: put editable defaults in place, without any onboarding form. */
export function ensureDefaults() {
  if (!store.hasRecord('config', 'schedule')) store.put('config', 'schedule', defaultSchedule(), { gen: true });
  if (!store.hasRecord('config', 'settings')) store.put('config', 'settings', defaultSettings(), { gen: true });
  if (!store.hasRecord('config', 'office')) store.put('config', 'office', defaultOfficeTemplate(), { gen: true });
  for (const r of defaultReminders()) if (!store.hasRecord('reminders', r.id)) store.put('reminders', r.id, r, { gen: true });
}

/** Create the next two weeks of routine occurrences (never past days). */
export function materializeRoutines() {
  const t = today();
  const existing = store.idsIncludingDeleted('tasks');
  for (const s of store.all('series')) {
    for (const occ of materializeOccurrences(s, existing, t, addDays(t, 13))) {
      occ.createdAt = Date.now();
      store.put('tasks', occ.id, occ, { gen: true });
    }
  }
}

// ---- tasks ----
export const tasks = () => store.all('tasks');
export const getTask = (id) => store.get('tasks', id);
export const saveTask = (t) => store.put('tasks', t.id, t);
export const deleteTask = (t) => {
  // Routine days keep a "skipped" record so they are not generated again.
  if (t.seriesId) store.put('tasks', t.id, { ...t, status: 'skipped' });
  else store.remove('tasks', t.id);
};

export function createTask(fields) {
  const t = { id: uid(), status: 'open', createdAt: Date.now(), ...fields };
  for (const key of Object.keys(t)) if (t[key] === '' || t[key] === undefined) delete t[key];
  saveTask(t);
  return t;
}

export const completeTask = (t) => saveTask(markDone(t));
export const reopenTask = (t) => saveTask(reopen(t));
export const rescheduleTask = (t, date) => saveTask(reschedule(t, date));
export const waitTask = (t, info) => saveTask(markWaiting(t, info));
export const resumeTask = (t) => saveTask({ ...t, status: 'open', plannedDate: today() });
export const laterTask = (t) => saveTask({ ...t, status: 'later', plannedDate: null, priorityDate: null });

export function setPriority(t, on) {
  const d = today();
  if (!on) return saveTask({ ...t, priorityDate: null });
  const count = tasks().filter((x) => x.priorityDate === d && x.id !== t.id && x.status === 'open').length;
  if (count >= 3) return false;
  saveTask({ ...t, priorityDate: d, priorityOrder: Date.now(), plannedDate: t.plannedDate && t.plannedDate <= d ? t.plannedDate : d, status: t.status === 'later' ? 'open' : t.status });
  return true;
}

// ---- routines ----
export const seriesList = () => store.all('series');

/** Save a routine and update its future (not individually changed) days. */
export function saveSeries(s) {
  const isNew = !store.get('series', s.id);
  const series = { ...s, id: s.id || uid() };
  store.put('series', series.id, series);
  if (!isNew) {
    const { update, remove } = applySeriesEdit(series, tasks().filter((x) => x.seriesId === series.id), today());
    update.forEach(saveTask);
    remove.forEach((id) => store.put('tasks', id, { ...getTask(id), status: 'skipped' }));
  }
  materializeRoutines();
  return series;
}

export function endSeries(s) {
  const t = today();
  store.put('series', s.id, { ...s, active: false, endDate: addDays(t, -1) });
  for (const occ of tasks()) {
    if (occ.seriesId === s.id && occ.status === 'open' && occ.occurrenceDate >= t && !occ.detached) {
      store.put('tasks', occ.id, { ...occ, status: 'skipped' });
    }
  }
}

// ---- other collections ----
export const reminders = () => store.all('reminders');
export const contentItems = () => store.all('content');
export const moneyEntries = () => store.all('money');
export const officeLog = (date) => store.get('office', date);
