// Reminder timing, shared by the app (to show "next reminder") and the server
// scheduler (to actually send). Fire times are always derived from the current
// data, so completing or rescheduling a task automatically cancels its old
// reminder: the old time is simply never produced again.
import { addDays, weekdayOf, zonedToUtc, zonedParts, toMinutes, fromMinutes, DEFAULT_TZ, daysBetween } from './time.js';
import { GENERIC_TEXT } from './defaults.js';

export function inQuietHours(time, settings) {
  const qs = settings?.quietStart, qe = settings?.quietEnd;
  if (!qs || !qe || qs === qe) return false;
  const t = toMinutes(time), s = toMinutes(qs), e = toMinutes(qe);
  return s > e ? t >= s || t < e : t >= s && t < e;
}

/** Shift a wall-clock time out of quiet hours to the end of the quiet period. */
export function applyQuietHours(date, time, settings) {
  if (!inQuietHours(time, settings)) return { date, time, shifted: false };
  const t = toMinutes(time), s = toMinutes(settings.quietStart);
  const crosses = s > toMinutes(settings.quietEnd);
  const nextDay = crosses && t >= s;
  return { date: nextDay ? addDays(date, 1) : date, time: settings.quietEnd, shifted: true };
}

export function taskReminderDate(task) {
  const r = task.reminder;
  if (!r) return null;
  const days = Number(r.daysBefore) || 0;
  if (r.anchor === 'due') return task.dueDate ? addDays(task.dueDate, -days) : null;
  if (r.anchor === 'planned') return task.plannedDate ? addDays(task.plannedDate, -days) : null;
  if (r.anchor === 'followup') return task.followUpDate || null;
  if (r.anchor === 'fixed') return r.date || null;
  return null;
}

const taskReminderActive = (t) => !t.deleted && t.reminder && t.reminder.enabled !== false &&
  (t.reminder.anchor === 'followup' ? t.status === 'waiting' : ['open', 'waiting', 'later'].includes(t.status));

/** Candidate wall-clock fire moments for a standalone reminder on dateStr. */
function reminderOnDate(rem, dateStr) {
  const s = rem.schedule || {};
  if (s.type === 'daily') return s.time;
  if (s.type === 'weekly') return weekdayOf(dateStr) === Number(s.weekday) ? s.time : null;
  if (s.type === 'once') return s.date === dateStr ? s.time : null;
  return null;
}

/**
 * All reminder sends whose (quiet-hours-adjusted) time falls in (fromMs, toMs].
 * Each has a stable `key` used by the server to guarantee it is sent once.
 */
export function dueReminders({ reminders = [], tasks = [], settings = {} }, fromMs, toMs) {
  const tz = settings.tz || DEFAULT_TZ;
  const out = [];
  const push = (key, date, time, textKey, ref) => {
    const adj = applyQuietHours(date, time, settings);
    const at = zonedToUtc(adj.date, adj.time, tz).getTime();
    if (at > fromMs && at <= toMs) out.push({ key, fireAt: at, textKey, ref, shifted: adj.shifted });
  };
  // Look one day either side so quiet-hour shifts across midnight are found.
  const first = addDays(zonedParts(new Date(fromMs), tz).date, -1);
  const span = daysBetween(first, addDays(zonedParts(new Date(toMs), tz).date, 1));

  for (const rem of reminders) {
    if (rem.deleted || rem.enabled === false) continue;
    for (let i = 0; i <= span; i++) {
      const date = addDays(first, i);
      const time = reminderOnDate(rem, date);
      if (time) push(`r:${rem.id}:${date}T${time}`, date, time, rem.textKey || 'custom', rem.id);
    }
  }
  for (const t of tasks) {
    if (!taskReminderActive(t)) continue;
    const date = taskReminderDate(t);
    const time = t.reminder.time || '09:00';
    if (date) push(`t:${t.id}:${date}T${time}`, date, time, 'task', t.id);
  }
  return out.sort((a, b) => a.fireAt - b.fireAt);
}

/** Next reminder after now within `days` days — for display in the app. */
export function nextReminders(data, now = Date.now(), days = 8) {
  return dueReminders(data, now, now + days * 86400000);
}

export const reminderText = (textKey) => GENERIC_TEXT[textKey] || GENERIC_TEXT.custom;
export { fromMinutes };
