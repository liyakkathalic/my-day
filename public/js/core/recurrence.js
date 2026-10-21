// Recurring routines ("series") create one separate task per day ("occurrence").
// Each occurrence has a deterministic id `${seriesId}@${date}`, so completing or
// rescheduling it never touches other days, and two devices generating the
// same occurrence produce the same record instead of a duplicate.
import { addDays, weekdayOf, daysBetween } from './time.js';

export const occurrenceId = (seriesId, date) => `${seriesId}@${date}`;

export function seriesDays(series) {
  if (series.freq === 'daily') return [0, 1, 2, 3, 4, 5, 6];
  if (series.freq === 'weekdays') return [1, 2, 3, 4, 5];
  return series.days || [];
}

export function seriesMatches(series, date) {
  if (series.active === false) return false;
  if (series.startDate && date < series.startDate) return false;
  if (series.endDate && date > series.endDate) return false;
  return seriesDays(series).includes(weekdayOf(date));
}

const COPIED = ['title', 'nextAction', 'category', 'owner', 'notes'];

export function makeOccurrence(series, date) {
  const occ = {
    id: occurrenceId(series.id, date),
    seriesId: series.id,
    occurrenceDate: date,
    plannedDate: date,
    status: 'open',
    detached: false,
  };
  for (const k of COPIED) if (series[k] != null) occ[k] = series[k];
  if (series.reminderTime) occ.reminder = { anchor: 'planned', daysBefore: 0, time: series.reminderTime };
  return occ;
}

/**
 * New occurrences needed for [fromDate, toDate]. Never creates past days, so a
 * week away from the app does not leave a pile of missed routines.
 */
export function materializeOccurrences(series, existingIds, fromDate, toDate) {
  const out = [];
  const span = daysBetween(fromDate, toDate);
  for (let i = 0; i <= span; i++) {
    const date = addDays(fromDate, i);
    if (!seriesMatches(series, date)) continue;
    const id = occurrenceId(series.id, date);
    if (!existingIds.has(id)) out.push(makeOccurrence(series, date));
  }
  return out;
}

/** Move one occurrence only. The series and every other day stay as they were. */
export function rescheduleOccurrence(task, newDate) {
  return { ...task, plannedDate: newDate, detached: true };
}

/**
 * After the series itself is edited ("change all future days"), compute the
 * changes to existing occurrences from `today` onward. Occurrences that were
 * individually changed (detached), completed, or are in the past are left alone.
 * Returns { update: [task], remove: [id] }.
 */
export function applySeriesEdit(series, occurrences, today) {
  const update = [];
  const remove = [];
  for (const occ of occurrences) {
    if (occ.seriesId !== series.id) continue;
    if (occ.detached || occ.status !== 'open' || occ.occurrenceDate < today) continue;
    if (!seriesMatches(series, occ.occurrenceDate)) {
      remove.push(occ.id);
      continue;
    }
    const next = { ...occ };
    let changed = false;
    for (const k of COPIED) {
      if ((series[k] ?? null) !== (occ[k] ?? null)) {
        if (series[k] == null) delete next[k]; else next[k] = series[k];
        changed = true;
      }
    }
    const wantRem = series.reminderTime ? { anchor: 'planned', daysBefore: 0, time: series.reminderTime } : undefined;
    if (JSON.stringify(wantRem) !== JSON.stringify(occ.reminder)) {
      if (wantRem) next.reminder = wantRem; else delete next.reminder;
      changed = true;
    }
    if (changed) update.push(next);
  }
  return { update, remove };
}
