import { addDays, weekdayOf, toMinutes, zonedParts, DEFAULT_TZ } from './time.js';

const crossesMidnight = (blk) => blk.end != null && toMinutes(blk.end) <= toMinutes(blk.start);

/** Blocks that start on dateStr, sorted by start time. */
export function blocksForDate(blocks, dateStr) {
  const wd = weekdayOf(dateStr);
  return blocks
    .filter((blk) => blk.days.includes(wd))
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start) || (a.end == null) - (b.end == null));
}

export function adminThemeFor(schedule, dateStr) {
  return schedule.themes?.[weekdayOf(dateStr)] || '';
}

/**
 * Current block and next block at instant `now` in time zone tz.
 * A block with no end time is a single moment (e.g. "Work shutdown"): it is
 * never "current" but can be "next".
 */
export function currentAndNext(blocks, now = new Date(), tz = DEFAULT_TZ) {
  const { date, minutes: t } = zonedParts(now, tz);
  const today = blocksForDate(blocks, date);
  const yesterday = blocksForDate(blocks, addDays(date, -1));

  let current = null;
  for (const blk of yesterday) {
    if (crossesMidnight(blk) && t < toMinutes(blk.end)) current = { ...blk, date: addDays(date, -1) };
  }
  for (const blk of today) {
    if (blk.end == null) continue;
    const s = toMinutes(blk.start);
    const e = toMinutes(blk.end);
    const inside = crossesMidnight(blk) ? t >= s : t >= s && t < e;
    // Later-starting blocks win, so a short block inside a long one shows.
    if (inside) current = { ...blk, date };
  }

  let next = today.find((blk) => toMinutes(blk.start) > t);
  if (next) next = { ...next, date };
  else {
    for (let i = 1; i <= 7 && !next; i++) {
      const d = addDays(date, i);
      const first = blocksForDate(blocks, d)[0];
      if (first) next = { ...first, date: d };
    }
  }
  return { current, next, date, minutes: t };
}

/** Minutes left until the current block ends (handles midnight crossing). */
export function minutesLeft(block, minutesNow) {
  if (!block?.end) return null;
  const e = toMinutes(block.end);
  return e > minutesNow ? e - minutesNow : e + 1440 - minutesNow;
}

/** Returns pairs of overlapping block titles for a day (excluding sleep and moments). */
export function findOverlaps(blocks, dateStr) {
  const list = blocksForDate(blocks, dateStr).filter((x) => x.end && !crossesMidnight(x));
  const out = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i], c = list[j];
      if (toMinutes(c.start) < toMinutes(a.end) && toMinutes(a.start) < toMinutes(c.end)) out.push([a, c]);
    }
  }
  return out;
}
