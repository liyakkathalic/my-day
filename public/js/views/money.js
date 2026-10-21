import { html, useState } from '../../vendor/preact-htm.js';
import { useStore, Card, openSheet, Field, toast, Segmented, Chips, EmptyState, askConfirm, SyncPill } from '../ui.js';
import { SubHeader } from './more.js';
import * as M from '../model.js';
import * as store from '../store.js';
import { MONEY_TYPES } from '../core/defaults.js';
import { fmtDate, isValidDate, relDate, addDays } from '../core/time.js';
import { deadlineLabel } from '../core/tasks.js';
import {
  SPEND_CATEGORIES, COMMON_ITEMS, itemCategory, PAY_METHODS, BANKS, payLabel, BILL_KINDS, REPEATS, category, repeatLabel, advanceBill, monthlyEquivalent,
  upcomingBills, dueLabel, monthOf, shiftMonth, monthSummary,
} from '../core/money.js';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const inr0 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const money = (n) => inr.format(Number(n) || 0);
const money0 = (n) => inr0.format(Math.round(Number(n) || 0));
const HAS_STATUS = new Set(['expected', 'receivable', 'payable']);
const HAS_CATEGORY = new Set(['spent', 'payable']);
const HAS_VIA = new Set(['spent', 'received']);
const outstanding = (e) => Math.max(0, (Number(e.amount) || 0) - (Number(e.paidAmount) || 0));
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = (ym) => `${MONTHS[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}`;
const shortDate = (d) => `${Number(d.slice(8))} ${MONTHS[Number(d.slice(5, 7)) - 1].slice(0, 3)}`;
const numInput = (v) => v.replace(/[^\d.]/g, '');

function CategorySelect({ id, value, onChange, ids }) {
  const list = ids ? SPEND_CATEGORIES.filter(([c]) => ids.includes(c)) : SPEND_CATEGORIES;
  return html`<select id=${id} value=${value || ''} onChange=${(x) => onChange(x.currentTarget.value)}>
    ${!value && html`<option value="" disabled>Choose a category</option>`}
    ${list.map(([c, label, icon]) => html`<option value=${c}>${icon}  ${label}</option>`)}
  </select>`;
}

// Remember how the last payment was made on this device, so the next one is one tap.
const LAST_PAY = 'myday-lastpay';
function lastPay() { try { return JSON.parse(localStorage.getItem(LAST_PAY)) || {}; } catch { return {}; } }
function rememberPay(via, bank) { try { localStorage.setItem(LAST_PAY, JSON.stringify({ via, bank })); } catch { /* private mode */ } }

/** Cash / Bank / Credit card, and which bank. */
function PaidVia({ via, bank, onChange, incoming = false }) {
  return html`<fieldset class="field"><legend class="field-label">${incoming ? 'Received in' : 'Paid via'}</legend>
    <${Segmented} label=${incoming ? 'Received in' : 'Paid via'} value=${via || ''} onChange=${(v) => onChange(v, v === 'cash' ? '' : bank)}
      options=${incoming ? PAY_METHODS.filter(([v]) => v !== 'card') : PAY_METHODS} />
    ${(via === 'bank' || via === 'card') && html`<select aria-label=${via === 'card' ? 'Card from which bank' : 'Which bank'} value=${bank || ''} onChange=${(x) => onChange(via, x.currentTarget.value)}>
      <option value="">${via === 'card' ? 'Which bank’s card?' : 'Which bank?'}</option>
      ${BANKS.map((b) => html`<option value=${b}>${b}</option>`)}
    </select>`}
  </fieldset>`;
}

/** Usual items as a dropdown; choosing one fills in the category. "Other" lets you type a name. */
function ItemSelect({ value, onPick }) {
  const known = COMMON_ITEMS.some(([n]) => n === value);
  const [other, setOther] = useState(!!value && !known);
  return html`<${Field} label="Item" id="me-item">
    <select id="me-item" value=${other ? '__other' : value || ''} onChange=${(x) => {
      const v = x.currentTarget.value;
      if (v === '__other') { setOther(true); onPick(known ? '' : value, null); } else { setOther(false); onPick(v, itemCategory(v)); }
    }}>
      <option value="">Choose an item (optional)</option>
      ${SPEND_CATEGORIES.map(([c, label, icon]) => {
        const items = COMMON_ITEMS.filter(([, cat]) => cat === c);
        return items.length ? html`<optgroup label=${`${icon} ${label}`}>${items.map(([n]) => html`<option value=${n}>${n}</option>`)}</optgroup>` : null;
      })}
      <option value="__other">Other (type a name)</option>
    </select>
    ${other && html`<input aria-label="Item name" placeholder="What was it?" value=${value || ''} onInput=${(x) => onPick(x.currentTarget.value, null)} />`}
  <//>`;
}

function EntryEditor({ entry, book, close, type: initialType }) {
  const isNew = !entry;
  const [e, setE] = useState(() => {
    if (entry) return { ...entry };
    const t = initialType || 'spent';
    const lp = lastPay();
    return { id: M.uid(), book, type: t, amount: '', date: M.today(), status: 'pending', ...(HAS_VIA.has(t) && lp.via ? { via: t === 'received' && lp.via === 'card' ? 'bank' : lp.via, bank: lp.bank || '' } : {}) };
  });
  const set = (k, v) => setE((x) => ({ ...x, [k]: v }));
  const amt = Number(e.amount);
  const valid = amt > 0 && isValidDate(e.date) && (!e.dueDate || isValidDate(e.dueDate));
  const save = (ev) => {
    ev.preventDefault();
    if (!valid) return;
    const data = { ...e, amount: Math.round(amt * 100) / 100 };
    if (!HAS_STATUS.has(data.type)) { delete data.status; delete data.dueDate; delete data.paidAmount; }
    if (!HAS_CATEGORY.has(data.type)) delete data.category;
    if (!HAS_VIA.has(data.type)) { delete data.via; delete data.bank; } else if (data.via) rememberPay(data.via, data.bank);
    store.put('money', data.id, data);
    close();
    toast('Saved');
  };
  const del = async () => { if (await askConfirm('Delete this entry?', { ok: 'Delete' })) { store.remove('money', e.id); close(); } };
  const spent = e.type === 'spent';
  return html`<form class="stack" onSubmit=${save}>
    <${Segmented} label="Book" value=${e.book} onChange=${(v) => set('book', v)} options=${[['personal', 'Personal'], ['business', 'Business']]} />
    <${Field} label="Type" id="me-type"><select id="me-type" value=${e.type} onChange=${(x) => set('type', x.currentTarget.value)}>${Object.entries(MONEY_TYPES).map(([v, l]) => html`<option value=${v}>${l}</option>`)}</select><//>
    ${spent && html`<${ItemSelect} value=${e.title} onPick=${(name, cat) => setE((x) => ({ ...x, title: name, ...(cat ? { category: cat } : {}) }))} />`}
    ${HAS_CATEGORY.has(e.type) && html`<${Field} label="Category" id="me-cat"><${CategorySelect} id="me-cat" value=${e.category} onChange=${(v) => set('category', v)} /><//>`}
    <${Field} label="Amount (₹)" id="me-amt"><input id="me-amt" type="text" inputmode="decimal" data-autofocus=${isNew} value=${e.amount} onInput=${(x) => set('amount', numInput(x.currentTarget.value))} /><//>
    ${HAS_VIA.has(e.type) && html`<${PaidVia} via=${e.via} bank=${e.bank} incoming=${e.type === 'received'} onChange=${(via, bank) => setE((x) => ({ ...x, via, bank }))} />`}
    <${Field} label=${e.type === 'receivable' ? 'Who owes me' : e.type === 'payable' ? 'Who I need to pay' : spent ? 'Paid to (optional)' : 'From / to (optional)'} id="me-party"><input id="me-party" value=${e.party || ''} onInput=${(x) => set('party', x.currentTarget.value)} /><//>
    ${!spent && html`<${Field} label="What for (optional)" id="me-title"><input id="me-title" value=${e.title || ''} onInput=${(x) => set('title', x.currentTarget.value)} /><//>`}
    <${Field} label="Date" id="me-date"><input id="me-date" type="date" value=${e.date} onInput=${(x) => set('date', x.currentTarget.value)} /><//>
    ${HAS_STATUS.has(e.type) && html`
      <${Field} label=${e.type === 'expected' ? 'Expected by (optional)' : 'Due date (optional)'} id="me-due"><input id="me-due" type="date" value=${e.dueDate || ''} onInput=${(x) => set('dueDate', x.currentTarget.value)} /><//>
      <${Field} label="Status" id="me-status"><select id="me-status" value=${e.status} onChange=${(x) => set('status', x.currentTarget.value)}>
        <option value="pending">Not paid yet</option><option value="partial">Partly paid</option><option value="paid">${e.type === 'payable' ? 'Paid' : 'Received'}</option></select><//>
      ${e.status === 'partial' && html`<${Field} label="Amount paid so far (₹)" id="me-paid"><input id="me-paid" inputmode="decimal" value=${e.paidAmount || ''} onInput=${(x) => set('paidAmount', numInput(x.currentTarget.value))} /><//>`}`}
    <${Field} label="Notes" id="me-notes"><textarea id="me-notes" rows="2" value=${e.notes || ''} onInput=${(x) => set('notes', x.currentTarget.value)}></textarea><//>
    <div class="sheet-actions">
      ${!isNew && html`<button type="button" class="btn quiet" onClick=${del}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!valid}>Save</button>
    </div>
  </form>`;
}

/** Settling a receivable/expected/payable can also record the actual money movement. */
function Settle({ entry, close }) {
  const [record, setRecord] = useState(true);
  const incoming = entry.type !== 'payable';
  const go = () => {
    store.put('money', entry.id, { ...entry, status: 'paid', paidAmount: entry.amount, settledOn: M.today() });
    if (record) {
      const id = M.uid();
      store.put('money', id, { id, book: entry.book, type: incoming ? 'received' : 'spent', amount: outstanding(entry) || entry.amount, party: entry.party, title: entry.title, date: M.today(), settles: entry.id, ...(incoming ? {} : { category: entry.category }) });
    }
    close();
    toast(incoming ? 'Marked as received' : 'Marked as paid');
  };
  return html`<div class="stack">
    <p>${money(outstanding(entry))} ${incoming ? 'from' : 'to'} ${entry.party || 'this entry'}.</p>
    <label class="check-row"><input type="checkbox" checked=${record} onChange=${(e) => setRecord(e.currentTarget.checked)} /> Also add it to “${incoming ? 'Money received' : 'Money spent'}” today</label>
    <div class="sheet-actions"><button class="btn" onClick=${go}>${incoming ? 'Mark as received' : 'Mark as paid'}</button></div>
  </div>`;
}

// ---------- regular payments (EMI, rent, renewals, fees) ----------

function BillEditor({ bill, book, close }) {
  const isNew = !bill;
  const [b, setB] = useState(() => bill ? { ...bill } : { id: M.uid(), type: 'bill', book, kind: 'emi', title: '', amount: '', repeat: 'monthly', nextDue: addDays(M.today(), 7), endDate: '' });
  const set = (k, v) => setB((x) => ({ ...x, [k]: v }));
  const amt = Number(b.amount);
  const valid = b.title.trim() && amt > 0 && isValidDate(b.nextDue) && (!b.endDate || isValidDate(b.endDate));
  const save = (ev) => {
    ev.preventDefault();
    if (!valid) return;
    const data = { ...b, title: b.title.trim(), amount: Math.round(amt * 100) / 100, dueDay: Number(b.nextDue.slice(8)), done: false };
    if (!data.endDate) delete data.endDate;
    store.put('money', data.id, data);
    close();
    toast(isNew ? 'Payment added' : 'Saved');
  };
  const del = async () => { if (await askConfirm('Delete this regular payment? Payments already recorded stay.', { ok: 'Delete' })) { store.remove('money', b.id); close(); } };
  return html`<form class="stack" onSubmit=${save}>
    <${Field} label="Name" id="bl-title"><input id="bl-title" data-autofocus=${isNew} placeholder="e.g. Car loan EMI, Netflix, School fees" value=${b.title} onInput=${(x) => set('title', x.currentTarget.value)} /><//>
    <${Field} label="Kind" id="bl-kind"><${CategorySelect} id="bl-kind" ids=${BILL_KINDS} value=${b.kind} onChange=${(v) => set('kind', v)} /><//>
    <${Field} label="Amount (₹)" hint="If it changes each time, put the usual amount. You can change it when you pay." id="bl-amt"><input id="bl-amt" inputmode="decimal" value=${b.amount} onInput=${(x) => set('amount', numInput(x.currentTarget.value))} /><//>
    <${Field} label="Repeats" id="bl-rep"><select id="bl-rep" value=${b.repeat} onChange=${(x) => set('repeat', x.currentTarget.value)}>${REPEATS.map(([v, l]) => html`<option value=${v}>${l}</option>`)}</select><//>
    <${Field} label="Next due date" id="bl-due"><input id="bl-due" type="date" value=${b.nextDue} onInput=${(x) => set('nextDue', x.currentTarget.value)} /><//>
    ${b.repeat !== 'once' && html`<${Field} label="Last payment on (optional)" hint="For an EMI or a plan that ends." id="bl-end"><input id="bl-end" type="date" value=${b.endDate || ''} onInput=${(x) => set('endDate', x.currentTarget.value)} /><//>`}
    <${Segmented} label="Book" value=${b.book} onChange=${(v) => set('book', v)} options=${[['personal', 'Personal'], ['business', 'Business']]} />
    <${Field} label="Notes" id="bl-notes"><textarea id="bl-notes" rows="2" placeholder="Account, policy number, how to pay…" value=${b.notes || ''} onInput=${(x) => set('notes', x.currentTarget.value)}></textarea><//>
    <div class="sheet-actions">
      ${!isNew && html`<button type="button" class="btn quiet" onClick=${del}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!valid}>Save</button>
    </div>
  </form>`;
}

function PayBill({ bill, close }) {
  const [amount, setAmount] = useState(String(bill.amount));
  const [record, setRecord] = useState(true);
  const [pay, setPay] = useState(() => ({ via: bill.via || lastPay().via || '', bank: bill.bank || lastPay().bank || '' }));
  const amt = Number(amount);
  const after = advanceBill(bill);
  const go = () => {
    if (record) {
      const id = M.uid();
      store.put('money', id, { id, book: bill.book, type: 'spent', category: bill.kind, amount: Math.round(amt * 100) / 100, title: bill.title, date: M.today(), billId: bill.id, forDue: bill.nextDue, ...(pay.via ? pay : {}) });
    }
    if (pay.via) rememberPay(pay.via, pay.bank);
    store.put('money', bill.id, { ...after, lastPaid: M.today(), ...(pay.via ? pay : {}) });
    close();
    toast(after.done ? `${bill.title}: all paid` : `Paid. Next due ${fmtDate(after.nextDue)}`);
  };
  return html`<div class="stack">
    <p><strong>${bill.title}</strong> · due ${fmtDate(bill.nextDue)}</p>
    <${Field} label="Amount paid (₹)" id="pb-amt"><input id="pb-amt" inputmode="decimal" value=${amount} onInput=${(x) => setAmount(numInput(x.currentTarget.value))} /><//>
    <${PaidVia} via=${pay.via} bank=${pay.bank} onChange=${(via, bank) => setPay({ via, bank })} />
    <label class="check-row"><input type="checkbox" checked=${record} onChange=${(e) => setRecord(e.currentTarget.checked)} /> Add it to “Money spent” today</label>
    <p class="hint">${after.done ? 'This was the last payment.' : `After this, the next one is due ${fmtDate(after.nextDue, { withYear: true })}.`}</p>
    <div class="sheet-actions"><button class="btn" disabled=${record && !(amt > 0)} onClick=${go}>Mark as paid</button></div>
  </div>`;
}

function BillRow({ b, today }) {
  const c = category(b.kind);
  const late = b.nextDue < today;
  const soon = !late && b.nextDue <= addDays(today, 3);
  return html`<li class="bill">
    <button class="bill-main" onClick=${() => openSheet('Edit regular payment', BillEditor, { bill: b })}>
      <span class="cat-icon" style=${`--h:${c.hue}`} aria-hidden="true">${c.icon}</span>
      <span class="bill-text">
        <span class="task-title">${b.title}</span>
        <span class=${'task-meta' + (late ? ' late' : soon ? ' soon' : '')}>${b.done ? 'Finished' : `${dueLabel(b.nextDue, today)} · ${shortDate(b.nextDue)}`} · ${repeatLabel(b.repeat, true)}</span>
      </span>
      <span class="amt">${money0(b.amount)}</span>
    </button>
    ${!b.done && html`<button class="btn small secondary" onClick=${() => openSheet('Mark as paid', PayBill, { bill: b })} aria-label=${`Mark ${b.title} as paid`}>Paid</button>`}
  </li>`;
}

function UpcomingPayments({ entries, book, today }) {
  const [showAll, setShowAll] = useState(false);
  const bills = entries.filter((e) => e.type === 'bill' && e.book === book);
  const active = bills.filter((b) => !b.done);
  const soon = upcomingBills(bills, today, 30);
  const list = showAll ? [...active].sort((a, b) => a.nextDue.localeCompare(b.nextDue)).concat(bills.filter((b) => b.done)) : soon;
  const dueSum = soon.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  const perMonth = active.reduce((a, b) => a + monthlyEquivalent(b), 0);
  return html`<${Card} title="Upcoming payments" cls="payments" action=${html`<button class="link-btn" onClick=${() => openSheet('New regular payment', BillEditor, { book })}>+ Add</button>`}>
    ${active.length ? html`<p class="hint">${soon.length ? `${money0(dueSum)} due in the next 30 days` : 'Nothing due in the next 30 days'} · about ${money0(perMonth)} a month in regular payments</p>`
      : html`<p class="hint">Add EMIs, rent, insurance, renewals and fees once. They come back here before each due date, and on Today.</p>`}
    ${list.length > 0 && html`<ul class="bill-list">${list.map((b) => html`<${BillRow} key=${b.id} b=${b} today=${today} />`)}</ul>`}
    ${bills.length > soon.length && html`<button class="link-btn more" onClick=${() => setShowAll(!showAll)}>${showAll ? 'Show only the next 30 days' : `All regular payments (${bills.length})`}</button>`}
    ${!active.length && html`<button class="btn secondary" onClick=${() => openSheet('New regular payment', BillEditor, { book })}>+ Add a regular payment</button>`}
  <//>`;
}

// ---------- dashboard ----------

function DayChart({ byDay, month, today }) {
  const [sel, setSel] = useState(null);
  const max = Math.max(...byDay, 1);
  const n = byDay.length, W = 300, H = 90, gap = 2, bw = (W - gap * (n - 1)) / n;
  const todayIdx = monthOf(today) === month ? Number(today.slice(8)) - 1 : -1;
  const shown = sel ?? (todayIdx >= 0 ? todayIdx : null);
  const dayStr = (i) => `${month}-${String(i + 1).padStart(2, '0')}`;
  return html`<div class="day-chart">
    <p class="chart-readout">${shown != null ? html`<strong>${money0(byDay[shown])}</strong> on ${fmtDate(dayStr(shown))}` : 'Tap a day to see what you spent'}</p>
    <svg viewBox=${`0 0 ${W} ${H + 14}`} role="img" aria-label=${`Spending per day in ${monthName(month)}`} preserveAspectRatio="none">
      <line x1="0" x2=${W} y1=${H + 0.5} y2=${H + 0.5} class="axis" />
      ${byDay.map((v, i) => {
        const h = v ? Math.max(3, (v / max) * (H - 4)) : 0;
        const x = i * (bw + gap);
        return html`<g key=${i} onClick=${() => setSel(i)} class=${'d' + (i === shown ? ' sel' : '') + (i === todayIdx ? ' today' : '')}>
          <rect class="hit" x=${x} y="0" width=${bw + gap} height=${H + 14} />
          ${h > 0 && html`<rect class="bar" x=${x} y=${H - h} width=${bw} height=${h} rx="1.5" />`}
          <title>${fmtDate(dayStr(i))}: ${money0(v)}</title>
        </g>`;
      })}
      ${[0, 9, 19, n - 1].map((i) => html`<text key=${'t' + i} x=${i * (bw + gap) + bw / 2} y=${H + 12} text-anchor="middle" class="tick">${i + 1}</text>`)}
    </svg>
  </div>`;
}

function Dashboard({ entries, book, month, setMonth, today, cat, setCat }) {
  const s = monthSummary(entries, book, month);
  const prev = monthSummary(entries, book, shiftMonth(month, -1));
  const isThis = month === monthOf(today);
  const daysSoFar = isThis ? Number(today.slice(8)) : s.byDay.length;
  const change = prev.spent ? (s.spent - prev.spent) / prev.spent : null;
  const top = s.categories[0]?.total || 1;
  return html`
    <div class="month-nav">
      <button class="icon-btn" aria-label="Previous month" onClick=${() => setMonth(shiftMonth(month, -1))}>‹</button>
      <span class="month-label">${monthName(month)}</span>
      <button class="icon-btn" aria-label="Next month" disabled=${isThis} onClick=${() => setMonth(shiftMonth(month, 1))}>›</button>
    </div>
    <section class="card hero-stat" aria-label="Month totals">
      <p class="eyebrow">Spent${isThis ? ' this month' : ''}</p>
      <p class="hero-num">${money0(s.spent)}</p>
      <p class="hint">${change == null ? `${s.count} expense${s.count === 1 ? '' : 's'}`
        : html`<span class=${change > 0 ? 'up' : 'down'}>${change > 0 ? '▲' : '▼'} ${Math.abs(Math.round(change * 100))}%</span> vs ${MONTHS[Number(shiftMonth(month, -1).slice(5)) - 1]}${isThis ? ' (full month)' : ''}`}</p>
      <dl class="mini-stats">
        <div><dt>Received</dt><dd>${money0(s.received)}</dd></div>
        <div><dt>Daily average</dt><dd>${money0(s.spent / Math.max(1, daysSoFar))}</dd></div>
        <div><dt>Left over</dt><dd class=${s.received - s.spent < 0 ? 'neg' : ''}>${money0(s.received - s.spent)}</dd></div>
      </dl>
    </section>
    <${Card} title="Where it went">
      ${s.categories.length ? html`<ul class="cat-bars">${s.categories.map((c) => html`<li key=${c.id}>
        <button class=${'cat-bar' + (cat === c.id ? ' on' : '')} aria-pressed=${cat === c.id} onClick=${() => setCat(cat === c.id ? '' : c.id)}>
          <span class="cat-name"><span class="cat-dot" style=${`--h:${c.hue}`} aria-hidden="true">${c.icon}</span> ${c.label}</span>
          <span class="cat-amt">${money0(c.total)} <span class="muted">· ${Math.round(c.share * 100)}%</span></span>
          <span class="track" aria-hidden="true"><span style=${`width:${Math.max(2, (c.total / top) * 100)}%`}></span></span>
        </button>
      </li>`)}</ul><p class="hint">Tap a category to see its entries below.</p>`
        : html`<${EmptyState}>No spending recorded for ${monthName(month)} yet.<//>`}
    <//>
    ${s.count > 0 && html`<${Card} title="Day by day"><${DayChart} byDay=${s.byDay} month=${month} today=${today} /><//>`}
    ${s.count > 0 && html`<${Card} title="How you paid">
      <ul class="pay-list">${s.methods.map((m) => html`<li key=${m.label}><span>${m.label}</span><span class="cat-amt">${money0(m.total)} <span class="muted">· ${Math.round((m.total / s.spent) * 100)}%</span></span></li>`)}</ul>
    <//>`}`;
}

const FILTERS = Object.entries(MONEY_TYPES);

export const openExpense = (book = 'personal') => openSheet('New expense', EntryEditor, { book, type: 'spent' });

export function MoneyView({ asTab = false }) {
  useStore();
  const today = M.today();
  const [book, setBook] = useState('personal');
  const [type, setType] = useState('');
  const [month, setMonth] = useState(monthOf(today));
  const [cat, setCat] = useState('');
  const all = M.moneyEntries();
  const entries = all.filter((e) => e.book === book && e.type !== 'bill');
  const sum = (list, f = (e) => Number(e.amount) || 0) => list.reduce((a, e) => a + f(e), 0);
  const open = (t) => entries.filter((e) => e.type === t && e.status !== 'paid');
  const isOpen = (e) => HAS_STATUS.has(e.type) && e.status !== 'paid';
  const list = entries
    .filter((e) => (e.date && monthOf(e.date) === month) || (isOpen(e) && !cat))
    .filter((e) => !type || e.type === type)
    .filter((e) => !cat || (e.type === 'spent' && (category(e.category).id === cat)))
    .sort((a, b) => (isOpen(a) ? 0 : 1) - (isOpen(b) ? 0 : 1) || (b.date || '').localeCompare(a.date || ''))
    .slice(0, 300);
  const add = (t) => openSheet(t === 'spent' ? 'New expense' : t === 'received' ? 'Money received' : 'New entry', EntryEditor, { book, type: t });

  return html`<div class="screen money">
    ${asTab ? html`<header class="top"><div><p class="eyebrow">Spending and payments</p><h1 class="hero">Money</h1></div><${SyncPill} /></header>` : html`<${SubHeader} title="Money" />`}
    <${Segmented} label="Book" value=${book} onChange=${(v) => { setBook(v); setCat(''); }} options=${[['personal', 'Personal'], ['business', 'Business']]} />
    <div class="quick-add">
      <button class="btn" onClick=${() => add('spent')}>+ Expense</button>
      <button class="btn secondary" onClick=${() => add('received')}>+ Income</button>
      <button class="btn secondary" aria-label="+ New entry" onClick=${() => add(type && type !== 'spent' && type !== 'received' ? type : 'payable')}>+ Other</button>
    </div>
    <${Dashboard} entries=${all.filter((e) => e.type !== 'bill')} book=${book} month=${month} setMonth=${(m) => { setMonth(m); setCat(''); }} today=${today} cat=${cat} setCat=${setCat} />
    <${UpcomingPayments} entries=${all} book=${book} today=${today} />
    <${Card} title="Owed and expected">
      <dl class="sums">
        <div><dt>Others owe me</dt><dd>${money(sum(open('receivable'), outstanding))}</dd></div>
        <div><dt>I need to pay</dt><dd>${money(sum(open('payable'), outstanding))}</dd></div>
        <div class="wide"><dt>Expected income (not received yet)</dt><dd>${money(sum(open('expected'), outstanding))}</dd></div>
      </dl>
    <//>
    <div class="card-head list-head">
      <h2>${cat ? `${category(cat).icon} ${category(cat).label} · ${monthName(month)}` : `Entries · ${monthName(month)}`}</h2>
      ${cat && html`<button class="link-btn" onClick=${() => setCat('')}>Show all</button>`}
    </div>
    ${!cat && html`<${Chips} label="Type" options=${FILTERS} value=${type} onChange=${setType} />`}
    ${list.length ? html`<ul class="money-list">${list.map((e) => html`<li key=${e.id} class="money-row">
      <button class="money-main" onClick=${() => openSheet('Edit entry', EntryEditor, { entry: e, book })}>
        <span class="m-top"><span class="task-title">${HAS_CATEGORY.has(e.type) && html`<span aria-hidden="true">${category(e.category).icon} </span>`}${e.party || e.title || (e.type === 'spent' ? category(e.category).label : MONEY_TYPES[e.type])}</span><span class=${'amt ' + e.type}>${money(e.amount)}</span></span>
        <span class="task-meta">${[e.type === 'spent' ? category(e.category).label : MONEY_TYPES[e.type], e.title && e.party ? e.title : '', fmtDate(e.date), payLabel(e),
          HAS_STATUS.has(e.type) && (e.status === 'paid' ? (e.type === 'payable' ? 'Paid' : 'Received') : e.status === 'partial' ? `Partly paid · ${money(outstanding(e))} left` : 'Not paid yet'),
          HAS_STATUS.has(e.type) && e.status !== 'paid' && e.dueDate && `${deadlineLabel(e.dueDate, today)} (${relDate(e.dueDate, today)})`].filter(Boolean).join(' · ')}</span>
      </button>
      ${isOpen(e) && html`<button class="btn small secondary" onClick=${() => openSheet(e.type === 'payable' ? 'Mark as paid' : 'Mark as received', Settle, { entry: e })}>${e.type === 'payable' ? 'Paid' : 'Received'}</button>`}
    </li>`)}</ul>` : html`<${EmptyState}>No entries for ${monthName(month)}.<//>`}
  </div>`;
}
