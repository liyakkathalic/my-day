import { html, useState } from '../../vendor/preact-htm.js';
import { useStore, Card, openSheet, Field, toast, Segmented, Chips, EmptyState } from '../ui.js';
import { SubHeader } from './more.js';
import * as M from '../model.js';
import * as store from '../store.js';
import { MONEY_TYPES } from '../core/defaults.js';
import { fmtDate, isValidDate, relDate } from '../core/time.js';
import { deadlineLabel } from '../core/tasks.js';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const money = (n) => inr.format(Number(n) || 0);
const HAS_STATUS = new Set(['expected', 'receivable', 'payable']);
const outstanding = (e) => Math.max(0, (Number(e.amount) || 0) - (Number(e.paidAmount) || 0));

function EntryEditor({ entry, book, close, type: initialType }) {
  const isNew = !entry;
  const [e, setE] = useState(() => entry ? { ...entry } : { id: M.uid(), book, type: initialType || 'spent', amount: '', date: M.today(), status: 'pending' });
  const set = (k, v) => setE((x) => ({ ...x, [k]: v }));
  const amt = Number(e.amount);
  const valid = amt > 0 && isValidDate(e.date) && (!e.dueDate || isValidDate(e.dueDate));
  const save = (ev) => {
    ev.preventDefault();
    if (!valid) return;
    const data = { ...e, amount: Math.round(amt * 100) / 100 };
    if (!HAS_STATUS.has(data.type)) { delete data.status; delete data.dueDate; delete data.paidAmount; }
    store.put('money', data.id, data);
    close();
    toast('Saved');
  };
  const del = () => { if (confirm('Delete this entry?')) { store.remove('money', e.id); close(); } };
  return html`<form class="stack" onSubmit=${save}>
    <${Segmented} label="Book" value=${e.book} onChange=${(v) => set('book', v)} options=${[['personal', 'Personal'], ['business', 'Business']]} />
    <${Field} label="Type" id="me-type"><select id="me-type" value=${e.type} onChange=${(x) => set('type', x.currentTarget.value)}>${Object.entries(MONEY_TYPES).map(([v, l]) => html`<option value=${v}>${l}</option>`)}</select><//>
    <${Field} label="Amount (₹)" id="me-amt"><input id="me-amt" type="text" inputmode="decimal" data-autofocus=${isNew} value=${e.amount} onInput=${(x) => set('amount', x.currentTarget.value.replace(/[^\d.]/g, ''))} /><//>
    <${Field} label=${e.type === 'receivable' ? 'Who owes me' : e.type === 'payable' ? 'Who I need to pay' : 'From / to (optional)'} id="me-party"><input id="me-party" value=${e.party || ''} onInput=${(x) => set('party', x.currentTarget.value)} /><//>
    <${Field} label="What for (optional)" id="me-title"><input id="me-title" value=${e.title || ''} onInput=${(x) => set('title', x.currentTarget.value)} /><//>
    <${Field} label="Date" id="me-date"><input id="me-date" type="date" value=${e.date} onInput=${(x) => set('date', x.currentTarget.value)} /><//>
    ${HAS_STATUS.has(e.type) && html`
      <${Field} label=${e.type === 'expected' ? 'Expected by (optional)' : 'Due date (optional)'} id="me-due"><input id="me-due" type="date" value=${e.dueDate || ''} onInput=${(x) => set('dueDate', x.currentTarget.value)} /><//>
      <${Field} label="Status" id="me-status"><select id="me-status" value=${e.status} onChange=${(x) => set('status', x.currentTarget.value)}>
        <option value="pending">Not paid yet</option><option value="partial">Partly paid</option><option value="paid">${e.type === 'payable' ? 'Paid' : 'Received'}</option></select><//>
      ${e.status === 'partial' && html`<${Field} label="Amount paid so far (₹)" id="me-paid"><input id="me-paid" inputmode="decimal" value=${e.paidAmount || ''} onInput=${(x) => set('paidAmount', x.currentTarget.value.replace(/[^\d.]/g, ''))} /><//>`}`}
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
      store.put('money', id, { id, book: entry.book, type: incoming ? 'received' : 'spent', amount: outstanding(entry) || entry.amount, party: entry.party, title: entry.title, date: M.today(), settles: entry.id });
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

const FILTERS = [['', 'All'], ...Object.entries(MONEY_TYPES)];

export function MoneyView() {
  useStore();
  const [book, setBook] = useState('personal');
  const [type, setType] = useState('');
  const today = M.today();
  const month = today.slice(0, 7);
  const entries = M.moneyEntries().filter((e) => e.book === book);
  const sum = (list, f = (e) => Number(e.amount) || 0) => list.reduce((a, e) => a + f(e), 0);
  const thisMonth = entries.filter((e) => e.date?.startsWith(month));
  const open = (t) => entries.filter((e) => e.type === t && e.status !== 'paid');
  const list = entries.filter((e) => !type || e.type === type)
    .sort((a, b) => (HAS_STATUS.has(a.type) && a.status !== 'paid' ? 0 : 1) - (HAS_STATUS.has(b.type) && b.status !== 'paid' ? 0 : 1) || (b.date || '').localeCompare(a.date || ''))
    .slice(0, 200);

  return html`<div class="screen">
    <${SubHeader} title="Money" />
    <p class="hint">Simple manual notes of money in and out. Not accounting software, and not connected to any bank.</p>
    <${Segmented} label="Book" value=${book} onChange=${setBook} options=${[['personal', 'Personal'], ['business', 'Business']]} />
    <${Card} title=${`${book === 'personal' ? 'Personal' : 'Business'} · this month`}>
      <dl class="sums">
        <div><dt>Received</dt><dd>${money(sum(thisMonth.filter((e) => e.type === 'received')))}</dd></div>
        <div><dt>Spent</dt><dd>${money(sum(thisMonth.filter((e) => e.type === 'spent')))}</dd></div>
        <div><dt>Others owe me</dt><dd>${money(sum(open('receivable'), outstanding))}</dd></div>
        <div><dt>I need to pay</dt><dd>${money(sum(open('payable'), outstanding))}</dd></div>
        <div class="wide"><dt>Expected income (not received yet)</dt><dd>${money(sum(open('expected'), outstanding))}</dd></div>
      </dl>
    <//>
    <div class="row between">
      <button class="btn" onClick=${() => openSheet('New entry', EntryEditor, { book, type: type || undefined })}>+ New entry</button>
    </div>
    <${Chips} label="Type" options=${FILTERS.slice(1)} value=${type} onChange=${setType} />
    ${list.length ? html`<ul class="money-list">${list.map((e) => html`<li key=${e.id} class="money-row">
      <button class="money-main" onClick=${() => openSheet('Edit entry', EntryEditor, { entry: e, book })}>
        <span class="m-top"><span class="task-title">${e.party || e.title || MONEY_TYPES[e.type]}</span><span class=${'amt ' + e.type}>${money(e.amount)}</span></span>
        <span class="task-meta">${[MONEY_TYPES[e.type], e.title && e.party ? e.title : '', fmtDate(e.date),
          HAS_STATUS.has(e.type) && (e.status === 'paid' ? (e.type === 'payable' ? 'Paid' : 'Received') : e.status === 'partial' ? `Partly paid · ${money(outstanding(e))} left` : 'Not paid yet'),
          HAS_STATUS.has(e.type) && e.status !== 'paid' && e.dueDate && `${deadlineLabel(e.dueDate, today)} (${relDate(e.dueDate, today)})`].filter(Boolean).join(' · ')}</span>
      </button>
      ${HAS_STATUS.has(e.type) && e.status !== 'paid' && html`<button class="btn small secondary" onClick=${() => openSheet(e.type === 'payable' ? 'Mark as paid' : 'Mark as received', Settle, { entry: e })}>${e.type === 'payable' ? 'Paid' : 'Received'}</button>`}
    </li>`)}</ul>` : html`<${EmptyState}>No entries yet.<//>`}
  </div>`;
}
