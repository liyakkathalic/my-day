import { test } from 'node:test';
import assert from 'node:assert/strict';
import { todayStr, zonedToUtc, nowMinutes, startOfWeek, fmtTime, addDays } from '../public/js/core/time.js';
import { defaultBlocks, defaultSchedule } from '../public/js/core/defaults.js';
import { currentAndNext, adminThemeFor } from '../public/js/core/schedule.js';
import { materializeOccurrences, rescheduleOccurrence, applySeriesEdit, occurrenceId } from '../public/js/core/recurrence.js';
import { tasksForList, markDone, followUpDue, reschedule, upcomingDeadlines } from '../public/js/core/tasks.js';
import { dueReminders, applyQuietHours } from '../public/js/core/reminders.js';
import { defaultReminders, defaultSettings } from '../public/js/core/defaults.js';

const TZ = 'Asia/Kolkata';
const ist = (date, time) => zonedToUtc(date, time, TZ); // IST wall-clock -> instant

test('Asia/Kolkata date boundary is at 18:30 UTC', () => {
  assert.equal(todayStr(TZ, new Date('2026-10-21T18:29:00Z')), '2026-10-21');
  assert.equal(todayStr(TZ, new Date('2026-10-21T18:30:00Z')), '2026-10-22');
  assert.equal(ist('2026-10-21', '09:00').toISOString(), '2026-10-21T03:30:00.000Z');
  assert.equal(nowMinutes(TZ, new Date('2026-10-21T03:30:00Z')), 9 * 60);
});

test('week starts Monday; time formatting', () => {
  assert.equal(startOfWeek('2026-10-21'), '2026-10-19'); // Wednesday -> Monday
  assert.equal(startOfWeek('2026-10-25'), '2026-10-19'); // Sunday belongs to same week
  assert.equal(fmtTime('21:30'), '9:30 PM');
  assert.equal(fmtTime('00:05'), '12:05 AM');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});

test('current and next block on a weekday', () => {
  const blocks = defaultBlocks();
  const r = currentAndNext(blocks, ist('2026-10-21', '10:15'), TZ); // Wednesday
  assert.equal(r.current.title, 'Topic research and references');
  assert.equal(r.next.title, 'Break and calls');
  const live = currentAndNext(blocks, ist('2026-10-21', '20:30'), TZ);
  assert.equal(live.current.title, 'Live session');
  const shut = currentAndNext(blocks, ist('2026-10-21', '21:20'), TZ);
  assert.equal(shut.next.title, 'Work shutdown');
});

test('sleep window crosses midnight', () => {
  const blocks = defaultBlocks();
  const late = currentAndNext(blocks, ist('2026-10-21', '23:30'), TZ);
  assert.equal(late.current.title, 'Protected sleep window');
  const early = currentAndNext(blocks, ist('2026-10-22', '05:00'), TZ);
  assert.equal(early.current.title, 'Protected sleep window');
  assert.equal(early.next.title, 'Personal routine, breakfast and family');
});

test('Saturday has no live session; Sunday weekly review; admin themes', () => {
  const blocks = defaultBlocks();
  const sat = currentAndNext(blocks, ist('2026-10-24', '20:30'), TZ);
  assert.notEqual(sat.current?.kind, 'live');
  const sun = currentAndNext(blocks, ist('2026-10-25', '18:05'), TZ);
  assert.equal(sun.current.title, 'Weekly review');
  const s = defaultSchedule();
  assert.equal(adminThemeFor(s, '2026-10-20'), 'Bank, credit and legal follow-ups'); // Tuesday
  assert.equal(adminThemeFor(s, '2026-10-24'), '');
});

const series = { id: 's1', title: 'Water plants', category: 'Personal', freq: 'daily', startDate: '2026-10-01' };

test('recurring routine creates separate occurrences; completing one leaves others', () => {
  const occ = materializeOccurrences(series, new Set(), '2026-10-21', '2026-10-23');
  assert.deepEqual(occ.map((o) => o.id), ['s1@2026-10-21', 's1@2026-10-22', 's1@2026-10-23']);
  const done = markDone(occ[0]);
  const all = [done, occ[1], occ[2]];
  assert.equal(all.filter((t) => t.status === 'done').length, 1);
  // Already-existing ids are not generated again (no duplicates).
  const again = materializeOccurrences(series, new Set(all.map((t) => t.id)), '2026-10-21', '2026-10-24');
  assert.deepEqual(again.map((o) => o.id), ['s1@2026-10-24']);
  // Next day's list still has its own open occurrence.
  assert.equal(tasksForList(all, 'today', '2026-10-22').length, 1);
});

test('never back-fills missed past days', () => {
  const occ = materializeOccurrences(series, new Set(), '2026-10-21', '2026-10-21');
  assert.equal(occ.length, 1);
  // Yesterday's unfinished routine does not show in Today.
  const stale = { ...occ[0], plannedDate: '2026-10-20', occurrenceDate: '2026-10-20', id: occurrenceId('s1', '2026-10-20') };
  assert.equal(tasksForList([stale], 'today', '2026-10-21').length, 0);
});

test('rescheduling one occurrence does not change the series or other days', () => {
  const occ = materializeOccurrences(series, new Set(), '2026-10-21', '2026-10-23');
  const moved = rescheduleOccurrence(occ[0], '2026-10-25');
  assert.equal(moved.plannedDate, '2026-10-25');
  assert.equal(moved.occurrenceDate, '2026-10-21');
  assert.equal(moved.detached, true);
  assert.equal(series.title, 'Water plants');
  // A later series edit leaves the moved occurrence alone but updates the others.
  const edited = { ...series, title: 'Water the plants' };
  const { update } = applySeriesEdit(edited, [moved, occ[1], occ[2]], '2026-10-21');
  assert.deepEqual(update.map((u) => u.id), ['s1@2026-10-22', 's1@2026-10-23']);
  assert.ok(update.every((u) => u.title === 'Water the plants'));
  // Generic reschedule helper also marks routine occurrences as detached.
  assert.equal(reschedule(occ[1], '2026-10-30').detached, true);
});

test('series edit removes future occurrences that no longer match', () => {
  const occ = materializeOccurrences(series, new Set(), '2026-10-21', '2026-10-25');
  const weekdaysOnly = { ...series, freq: 'weekdays' };
  const { remove } = applySeriesEdit(weekdaysOnly, occ, '2026-10-21');
  assert.deepEqual(remove, ['s1@2026-10-24', 's1@2026-10-25']);
});

test('planned date and deadline stay separate; waiting not overdue before follow-up', () => {
  const t = { id: 'a', title: 'x', status: 'open', plannedDate: '2026-10-28', dueDate: '2026-11-15' };
  assert.equal(tasksForList([t], 'today', '2026-10-21').length, 0);
  assert.equal(tasksForList([t], 'later', '2026-10-21').length, 1);
  const later = { id: 'l', status: 'later', dueDate: '2026-10-25' };
  assert.equal(upcomingDeadlines([later], '2026-10-21').length, 1);
  const w = { id: 'w', status: 'waiting', waitingFor: 'Bank', followUpDate: '2026-10-24' };
  assert.equal(followUpDue(w, '2026-10-21'), false);
  assert.equal(followUpDue(w, '2026-10-24'), true);
});

test('default reminders fire at the right IST instants, once each', () => {
  const data = { reminders: defaultReminders(), tasks: [], settings: defaultSettings() };
  const day = dueReminders(data, ist('2026-10-25', '00:00').getTime(), ist('2026-10-25', '23:59').getTime()); // Sunday
  assert.deepEqual(day.map((d) => d.textKey), ['office', 'review', 'shutdown']);
  assert.equal(new Date(day[0].fireAt).toISOString(), '2026-10-25T03:30:00.000Z');
  // Adjacent windows never produce the same key twice.
  const mid = ist('2026-10-25', '12:00').getTime();
  const a = dueReminders(data, ist('2026-10-25', '00:00').getTime(), mid).map((d) => d.key);
  const b = dueReminders(data, mid, ist('2026-10-25', '23:59').getTime()).map((d) => d.key);
  assert.equal(a.filter((k) => b.includes(k)).length, 0);
});

test('quiet hours shift a reminder to 7:00 AM', () => {
  const s = defaultSettings();
  assert.deepEqual(applyQuietHours('2026-10-21', '23:15', s), { date: '2026-10-22', time: '07:00', shifted: true });
  assert.deepEqual(applyQuietHours('2026-10-22', '06:00', s), { date: '2026-10-22', time: '07:00', shifted: true });
  assert.equal(applyQuietHours('2026-10-21', '21:30', s).shifted, false);
});

test('task reminders cancel on completion and move on reschedule', () => {
  const settings = defaultSettings();
  const task = { id: 't1', status: 'open', plannedDate: '2026-10-22', reminder: { anchor: 'planned', daysBefore: 0, time: '10:00' } };
  const win = [ist('2026-10-21', '00:00').getTime(), ist('2026-10-31', '00:00').getTime()];
  assert.equal(dueReminders({ tasks: [task], settings }, ...win)[0].key, 't:t1:2026-10-22T10:00');
  assert.equal(dueReminders({ tasks: [markDone(task)], settings }, ...win).length, 0);
  const moved = reschedule(task, '2026-10-27');
  const keys = dueReminders({ tasks: [moved], settings }, ...win).map((d) => d.key);
  assert.deepEqual(keys, ['t:t1:2026-10-27T10:00']);
});

test('built-in quote is stable for a day and changes the next day', async () => {
  const { builtInQuote, QUOTES } = await import('../public/js/core/quotes.js');
  const a = builtInQuote('2026-10-21');
  assert.deepEqual(builtInQuote('2026-10-21'), a);
  assert.notEqual(builtInQuote('2026-10-22').q, a.q);
  assert.ok(QUOTES.every(([q, by]) => q && by));
});

test('money: monthly dashboard and regular payments', async () => {
  const { addMonths, advanceBill, upcomingBills, monthSummary, dueLabel, monthlyEquivalent } = await import('../public/js/core/money.js');
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2026-02-28', 1, 31), '2026-03-31'); // keeps the original due day
  assert.equal(addMonths('2026-11-15', 3), '2027-02-15');
  const emi = { id: 'b1', type: 'bill', book: 'personal', kind: 'emi', title: 'Car EMI', amount: 12000, repeat: 'monthly', nextDue: '2026-10-05', dueDay: 5, endDate: '2026-11-05' };
  const once = advanceBill(emi);
  assert.equal(once.nextDue, '2026-11-05');
  assert.ok(!once.done);
  assert.equal(advanceBill(once).done, true); // past its last payment
  assert.equal(advanceBill({ ...emi, repeat: 'once' }).done, true);
  assert.equal(monthlyEquivalent({ amount: 12000, repeat: 'yearly' }), 1000);
  const fees = { ...emi, id: 'b2', title: 'Fees', nextDue: '2026-12-30', repeat: 'yearly' };
  assert.deepEqual(upcomingBills([fees, emi, { type: 'spent' }], '2026-10-21', 30).map((b) => b.id), ['b1']); // late one included, far one not
  assert.equal(dueLabel('2026-10-19', '2026-10-21'), '2 days late');
  assert.equal(dueLabel('2026-10-22', '2026-10-21'), 'Due tomorrow');
  const s = monthSummary([
    { book: 'personal', type: 'spent', category: 'food', amount: 300, date: '2026-10-02' },
    { book: 'personal', type: 'spent', category: 'food', amount: 200, date: '2026-10-02' },
    { book: 'personal', type: 'spent', amount: 500, date: '2026-10-21' },
    { book: 'personal', type: 'received', amount: 5000, date: '2026-10-01' },
    { book: 'business', type: 'spent', category: 'food', amount: 999, date: '2026-10-02' },
    { book: 'personal', type: 'spent', category: 'food', amount: 999, date: '2026-09-30' },
  ], 'personal', '2026-10');
  assert.equal(s.spent, 1000);
  assert.equal(s.received, 5000);
  assert.deepEqual(s.categories.map((c) => [c.id, c.total]), [['food', 500], ['other', 500]]);
  assert.equal(s.byDay.length, 31);
  assert.equal(s.byDay[1], 500);
});
