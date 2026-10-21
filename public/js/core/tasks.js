// Task list rules. "Planned date" is when I intend to work on something;
// "deadline" (dueDate) is a real, confirmed deadline. They are never mixed.
import { endOfWeek, addDays, daysBetween } from './time.js';

export const LISTS = ['today', 'week', 'waiting', 'later', 'completed'];
export const LIST_LABELS = { today: 'Today', week: 'This Week', waiting: 'Waiting', later: 'Later', completed: 'Completed' };

const isOpen = (t) => t.status === 'open';
// A routine occurrence from a past day is simply missed; it does not pile up.
const isStaleRoutine = (t, today) => t.seriesId && t.plannedDate < today;

export function inToday(t, today) {
  if (!isOpen(t) || isStaleRoutine(t, today)) return false;
  return (t.plannedDate && t.plannedDate <= today) || t.dueDate === today || t.priorityDate === today;
}

export function inWeek(t, today) {
  if (!isOpen(t) || inToday(t, today)) return false;
  const end = endOfWeek(today);
  return (t.plannedDate && t.plannedDate > today && t.plannedDate <= end) ||
    (t.dueDate && t.dueDate > today && t.dueDate <= end);
}

export function inLater(t, today) {
  if (t.status === 'later') return true;
  if (!isOpen(t) || t.seriesId) return false;
  return !inToday(t, today) && !inWeek(t, today);
}

/** Waiting items are never "overdue" — they only come back on their follow-up date. */
export function followUpDue(t, today) {
  return t.status === 'waiting' && !!t.followUpDate && t.followUpDate <= today;
}

const byPlanned = (a, b) => (a.plannedDate || '9999').localeCompare(b.plannedDate || '9999') || (a.createdAt || 0) - (b.createdAt || 0);

export function tasksForList(tasks, list, today) {
  const live = tasks.filter((t) => !t.deleted);
  switch (list) {
    case 'today': return live.filter((t) => inToday(t, today)).sort(byPlanned);
    case 'week': return live.filter((t) => inWeek(t, today)).sort(byPlanned);
    case 'waiting': return live.filter((t) => t.status === 'waiting')
      .sort((a, b) => (a.followUpDate || '9999').localeCompare(b.followUpDate || '9999'));
    case 'later': return live.filter((t) => inLater(t, today)).sort(byPlanned);
    case 'completed': return live.filter((t) => t.status === 'done')
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
    default: return [];
  }
}

export function priorities(tasks, today) {
  return tasks.filter((t) => !t.deleted && t.priorityDate === today && (t.status === 'open' || t.status === 'done'))
    .sort((a, b) => (a.priorityOrder ?? 0) - (b.priorityOrder ?? 0));
}

/** Unfinished tasks (open, waiting or later) with a real deadline within `days` days (plus any passed, shown gently). */
export function upcomingDeadlines(tasks, today, days = 14) {
  const limit = addDays(today, days);
  return tasks.filter((t) => !t.deleted && t.dueDate && t.status !== 'done' && t.status !== 'skipped' && t.dueDate <= limit)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function deadlineLabel(dueDate, today) {
  const d = daysBetween(today, dueDate);
  if (d < 0) return 'Deadline passed';
  if (d === 0) return 'Due today';
  if (d === 1) return 'Due tomorrow';
  return `Due in ${d} days`;
}

/** Status changes. Each returns a new object; callers save it. */
export const markDone = (t, now = Date.now()) => ({ ...t, status: 'done', completedAt: now });
export const reopen = (t) => ({ ...t, status: 'open', completedAt: null });
export function markWaiting(t, { waitingFor, lastContact, followUpDate }) {
  return { ...t, status: 'waiting', waitingFor: waitingFor || t.waitingFor || '', lastContact, followUpDate };
}
export function reschedule(t, newDate) {
  const next = { ...t, plannedDate: newDate, status: t.status === 'later' ? 'open' : t.status };
  if (t.priorityDate && t.priorityDate !== newDate) next.priorityDate = null;
  if (t.seriesId) next.detached = true; // only this occurrence moves
  return next;
}
