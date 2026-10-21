// Time helpers. All "dates" in the app are plain 'YYYY-MM-DD' strings in the
// user's time zone (default Asia/Kolkata); times are 'HH:MM' (24-hour).
// Shared by the browser app and the server scheduler.

export const DEFAULT_TZ = 'Asia/Kolkata';

const fmtCache = new Map();
function partsFormatter(tz) {
  if (!fmtCache.has(tz)) {
    fmtCache.set(tz, new Intl.DateTimeFormat('en-US', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }));
  }
  return fmtCache.get(tz);
}

export function zonedParts(date, tz = DEFAULT_TZ) {
  const p = {};
  for (const { type, value } of partsFormatter(tz).formatToParts(date)) p[type] = value;
  const hour = Number(p.hour) % 24;
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    hour, minute: Number(p.minute), second: Number(p.second),
    minutes: hour * 60 + Number(p.minute),
  };
}

export const todayStr = (tz = DEFAULT_TZ, now = new Date()) => zonedParts(now, tz).date;
export const nowMinutes = (tz = DEFAULT_TZ, now = new Date()) => zonedParts(now, tz).minutes;

function toUTCms(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}
function fromUTCms(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

export const addDays = (dateStr, n) => fromUTCms(toUTCms(dateStr) + n * 86400000);
/** 0 = Sunday … 6 = Saturday */
export const weekdayOf = (dateStr) => new Date(toUTCms(dateStr)).getUTCDay();
export const daysBetween = (a, b) => Math.round((toUTCms(b) - toUTCms(a)) / 86400000);
export const isValidDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && fromUTCms(toUTCms(s)) === s;
export const isValidTime = (s) => typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

/** Monday of the week containing dateStr. */
export function startOfWeek(dateStr) {
  const wd = weekdayOf(dateStr);
  return addDays(dateStr, wd === 0 ? -6 : 1 - wd);
}
export const endOfWeek = (dateStr) => addDays(startOfWeek(dateStr), 6);

export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
export function fromMinutes(min) {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** Offset of tz from UTC at the given instant, in minutes (IST = +330). */
export function tzOffsetMinutes(date, tz = DEFAULT_TZ) {
  const p = zonedParts(date, tz);
  const asUTC = toUTCms(p.date) + (p.minutes * 60 + p.second) * 1000;
  return Math.round((asUTC - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

/** The real instant for a wall-clock date + time in tz. */
export function zonedToUtc(dateStr, hhmm, tz = DEFAULT_TZ) {
  const wall = toUTCms(dateStr) + toMinutes(hhmm) * 60000;
  let guess = wall - tzOffsetMinutes(new Date(wall), tz) * 60000;
  // Second pass handles zones with DST transitions near the guess.
  guess = wall - tzOffsetMinutes(new Date(guess), tz) * 60000;
  return new Date(guess);
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const weekdayName = (wd, short = false) => (short ? WEEKDAYS[wd].slice(0, 3) : WEEKDAYS[wd]);

export function fmtTime(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** 'Wed, 21 Oct' (short) or 'Wednesday, 21 October' (long). */
export function fmtDate(dateStr, { long = false, withYear = false } = {}) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const wd = weekdayOf(dateStr);
  const month = long ? MONTHS[m - 1] : MONTHS[m - 1].slice(0, 3);
  return `${weekdayName(wd, !long)}, ${d} ${month}${withYear ? ' ' + y : ''}`;
}

/** Friendly relative label: Today, Tomorrow, Yesterday, or the date. */
export function relDate(dateStr, today) {
  const diff = daysBetween(today, dateStr);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return fmtDate(dateStr, { withYear: Math.abs(diff) > 300 });
}
