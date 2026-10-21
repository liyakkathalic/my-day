// Money helpers: spending categories, the monthly dashboard and regular payments
// (EMI, rent, renewals, fees). Entries live in the 'money' collection; a regular
// payment is a record with type 'bill'. Dates are 'YYYY-MM-DD' strings.
import { addDays, daysBetween } from './time.js';

// [id, label, icon]
export const SPEND_CATEGORIES = [
  ['food', 'Food & groceries', '🛒'],
  ['eating', 'Eating out', '🍽️'],
  ['transport', 'Fuel & transport', '⛽'],
  ['bills', 'Bills & utilities', '💡'],
  ['household', 'Household', '🏠'],
  ['shopping', 'Shopping', '🛍️'],
  ['health', 'Health', '💊'],
  ['education', 'Education & fees', '🎓'],
  ['family', 'Family & gifts', '🎁'],
  ['fun', 'Fun & outings', '🎬'],
  ['emi', 'EMI & loans', '🏦'],
  ['rent', 'Rent', '🔑'],
  ['insurance', 'Insurance', '🛡️'],
  ['subs', 'Subscriptions & renewals', '🔁'],
  ['card', 'Credit card', '💳'],
  ['tax', 'Tax', '🧾'],
  ['work', 'Work & content', '🎥'],
  ['staff', 'Staff & wages', '👥'],
  ['other', 'Other', '📌'],
];
// A hue per category, for its coloured icon tile.
const CAT = Object.fromEntries(SPEND_CATEGORIES.map(([id, label, icon], i) => [id, { id, label, icon, hue: Math.round((i * 137.5) % 360) }]));
export const category = (id) => CAT[id] || CAT.other;

/** Usual expenses; picking one fills in its category. [name, category] */
export const COMMON_ITEMS = [
  ['Groceries', 'food'], ['Vegetables & fruits', 'food'], ['Milk', 'food'], ['Meat & fish', 'food'],
  ['Restaurant / hotel', 'eating'], ['Tea & snacks', 'eating'], ['Swiggy / Zomato', 'eating'],
  ['Petrol / diesel', 'transport'], ['Auto / taxi', 'transport'], ['Bus / train', 'transport'], ['Parking & toll', 'transport'], ['Vehicle service', 'transport'],
  ['Electricity bill', 'bills'], ['Water bill', 'bills'], ['Mobile recharge', 'bills'], ['Internet / broadband', 'bills'], ['Gas cylinder', 'bills'],
  ['House rent', 'rent'],
  ['Home repairs', 'household'], ['Cleaning & household items', 'household'], ['Maid / helper', 'household'],
  ['Clothes', 'shopping'], ['Online shopping', 'shopping'], ['Electronics', 'shopping'],
  ['Medicines', 'health'], ['Doctor / hospital', 'health'],
  ['School fees', 'education'], ['Tuition', 'education'], ['Books & stationery', 'education'],
  ['Gifts', 'family'], ['Family support', 'family'], ['Function / wedding', 'family'],
  ['Movies & outings', 'fun'], ['Travel / trip', 'fun'],
  ['EMI', 'emi'], ['Loan repayment', 'emi'],
  ['Insurance premium', 'insurance'],
  ['OTT / app subscription', 'subs'], ['Software & renewals', 'subs'],
  ['Credit card bill', 'card'],
  ['Income tax / GST', 'tax'],
  ['Editor payment', 'work'], ['Equipment & gear', 'work'],
  ['Salary / wages', 'staff'],
];
export const itemCategory = (name) => COMMON_ITEMS.find(([n]) => n === name)?.[1];

export const PAY_METHODS = [['cash', 'Cash'], ['bank', 'Bank / UPI'], ['card', 'Credit card']];
export const BANKS = ['Federal Bank', 'Axis Bank', 'Canara Bank', 'State Bank of India', 'South Indian Bank'];
/** "Cash", "Axis Bank", "Axis Bank card", or '' when not recorded. */
export function payLabel(e) {
  if (e.via === 'cash') return 'Cash';
  if (e.via === 'bank') return e.bank || 'Bank';
  if (e.via === 'card') return e.bank ? `${e.bank} card` : 'Credit card';
  return '';
}

/** Kinds offered for regular payments (a subset of the spending categories). */
export const BILL_KINDS = ['emi', 'rent', 'insurance', 'subs', 'education', 'bills', 'card', 'tax', 'other'];

export const REPEATS = [
  ['monthly', 'Every month', 1, 'Monthly'],
  ['quarterly', 'Every 3 months', 3, 'Quarterly'],
  ['halfyearly', 'Every 6 months', 6, 'Half-yearly'],
  ['yearly', 'Every year', 12, 'Yearly'],
  ['once', 'Only once', 0, 'One-time'],
];
const REPEAT_MONTHS = Object.fromEntries(REPEATS.map(([id, , m]) => [id, m]));
export const repeatLabel = (id, short = false) => (REPEATS.find((r) => r[0] === id) || REPEATS[0])[short ? 3 : 1];

const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate(); // m is 1-based

/** Same day-of-month `months` later, clamped (31 Jan + 1 month = 28/29 Feb). `day` keeps the original day. */
export function addMonths(dateStr, months, day) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const total = (y * 12 + (m - 1)) + months;
  const ny = Math.floor(total / 12), nm = total % 12 + 1;
  const nd = Math.min(day || d, daysInMonth(ny, nm));
  return `${ny}-${String(nm).padStart(2, '0')}-${String(nd).padStart(2, '0')}`;
}

/** The bill after one payment: next due date, or finished (once-only, or past its end date). */
export function advanceBill(bill) {
  const months = REPEAT_MONTHS[bill.repeat] ?? 1;
  if (!months) return { ...bill, done: true };
  const next = addMonths(bill.nextDue, months, bill.dueDay || Number(bill.nextDue.slice(8)));
  if (bill.endDate && next > bill.endDate) return { ...bill, nextDue: next, done: true };
  return { ...bill, nextDue: next };
}

/** Rough monthly cost of a regular payment (yearly ÷ 12 etc.); once-only payments count 0. */
export function monthlyEquivalent(bill) {
  const months = REPEAT_MONTHS[bill.repeat] ?? 1;
  return months ? (Number(bill.amount) || 0) / months : 0;
}

/** Active bills due on or before today + days (late ones included), soonest first. */
export function upcomingBills(entries, today, days = 30, book) {
  const until = addDays(today, days);
  return entries.filter((e) => e.type === 'bill' && !e.done && e.nextDue && e.nextDue <= until && (!book || e.book === book))
    .sort((a, b) => a.nextDue.localeCompare(b.nextDue) || (Number(b.amount) || 0) - (Number(a.amount) || 0));
}

export function dueLabel(date, today) {
  const n = daysBetween(today, date);
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  if (n > 1) return `Due in ${n} days`;
  return n === -1 ? '1 day late' : `${-n} days late`;
}

export const monthOf = (dateStr) => dateStr.slice(0, 7);
export function shiftMonth(month, n) { return addMonths(`${month}-01`, n).slice(0, 7); }

/** Totals, spending by category and spending per day for one book and month ('YYYY-MM'). */
export function monthSummary(entries, book, month) {
  const list = entries.filter((e) => e.book === book && e.date && monthOf(e.date) === month);
  const amt = (e) => Number(e.amount) || 0;
  const spentList = list.filter((e) => e.type === 'spent');
  const spent = spentList.reduce((a, e) => a + amt(e), 0);
  const received = list.filter((e) => e.type === 'received').reduce((a, e) => a + amt(e), 0);
  const byCat = new Map();
  for (const e of spentList) {
    const id = CAT[e.category] ? e.category : 'other';
    byCat.set(id, (byCat.get(id) || 0) + amt(e));
  }
  const categories = [...byCat].map(([id, total]) => ({ ...category(id), total, share: spent ? total / spent : 0 }))
    .sort((a, b) => b.total - a.total);
  const byMethod = new Map();
  for (const e of spentList) {
    const k = payLabel(e) || 'Not noted';
    byMethod.set(k, (byMethod.get(k) || 0) + amt(e));
  }
  const methods = [...byMethod].map(([label, total]) => ({ label, total })).sort((a, b) => b.total - a.total);
  const [y, m] = month.split('-').map(Number);
  const byDay = Array.from({ length: daysInMonth(y, m) }, () => 0);
  for (const e of spentList) byDay[Number(e.date.slice(8)) - 1] += amt(e);
  return { spent, received, categories, methods, byDay, count: spentList.length };
}
