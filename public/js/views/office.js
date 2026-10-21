import { html, useState, useEffect } from '../../vendor/preact-htm.js';
import { useStore, Card, openSheet, Field, toast, Segmented } from '../ui.js';
import { SubHeader } from './more.js';
import * as M from '../model.js';
import * as store from '../store.js';
import { fmtDate, relDate } from '../core/time.js';

const SLOTS = [['morning', 'Morning check'], ['closing', 'Closing check']];
const defaultSlot = () => (new Date().toLocaleString('en-GB', { timeZone: M.tz(), hour: '2-digit', hour12: false }) < '12' ? 'morning' : 'closing');

function Timer({ minutes }) {
  const [end, setEnd] = useState(null);
  const [, tick] = useState(0);
  useEffect(() => {
    if (!end) return;
    const t = setInterval(() => tick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [end]);
  if (!end) return html`<button class="btn small secondary" onClick=${() => setEnd(Date.now() + minutes * 60_000)}>Start ${minutes} min</button>`;
  const left = Math.max(0, Math.round((end - Date.now()) / 1000));
  return html`<span class="timer" role="timer" aria-live="off">${left ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} left` : 'Time is up'}
    <button class="link-btn" onClick=${() => setEnd(null)}>${left ? 'Stop' : 'Reset'}</button></span>`;
}

function TemplateEditor({ close }) {
  const [tpl, setTpl] = useState(() => JSON.parse(JSON.stringify(M.officeTemplate())));
  const save = (e) => { e.preventDefault(); M.saveOfficeTemplate(tpl); close(); toast('Checklist updated'); };
  return html`<form class="stack" onSubmit=${save}>
    ${tpl.sections.map((s, i) => html`<fieldset class="field">
      <legend class="field-label">Section ${i + 1}</legend>
      <input aria-label="Section title" value=${s.title} onInput=${(e) => { tpl.sections[i].title = e.currentTarget.value; setTpl({ ...tpl }); }} />
      <label class="inline">Minutes <input type="number" min="1" max="60" inputmode="numeric" value=${s.minutes} onInput=${(e) => { tpl.sections[i].minutes = Number(e.currentTarget.value) || 10; setTpl({ ...tpl }); }} /></label>
      ${!s.decisions && html`<textarea aria-label="Checklist items, one per line" rows="4" value=${s.items.join('\n')} onInput=${(e) => { tpl.sections[i].items = e.currentTarget.value.split('\n').map((x) => x.trim()).filter(Boolean); setTpl({ ...tpl }); }}></textarea>
        <span class="hint">One item per line.</span>`}
    </fieldset>`)}
    <div class="sheet-actions"><button class="btn" type="submit">Save checklist</button></div>
  </form>`;
}

export function OfficeView() {
  useStore();
  const today = M.today();
  const [slot, setSlot] = useState(defaultSlot());
  const [date, setDate] = useState(today);
  const id = `${date}-${slot}`;
  const tpl = M.officeTemplate();
  const log = store.get('office', id) || { date, slot, sections: {} };
  const save = (patch) => store.put('office', id, { ...log, ...patch, date, slot });
  const sec = (sid) => log.sections?.[sid] || {};
  const setSec = (sid, patch) => save({ sections: { ...log.sections, [sid]: { ...sec(sid), ...patch } } });
  const history = store.all('office').filter((l) => l.id !== id).sort((a, b) => b.id.localeCompare(a.id)).slice(0, 10);

  return html`<div class="screen">
    <${SubHeader} title="Office check" />
    <${Segmented} label="Which check" value=${slot} onChange=${setSlot} options=${SLOTS} />
    <p class="hint">${date === today ? 'Today' : fmtDate(date, { long: true })} · 30 minutes in three parts. The timer only runs while the app is open.</p>
    ${date !== today && html`<button class="link-btn" onClick=${() => setDate(today)}>Back to today</button>`}
    ${tpl.sections.map((s) => html`<${Card} key=${s.id} title=${`${s.title} · ${s.minutes} min`} action=${date === today && html`<${Timer} minutes=${s.minutes} />`}>
      ${s.decisions ? html`<${Decisions} items=${sec(s.id).decisions || []} onChange=${(decisions) => setSec(s.id, { decisions })} />`
        : html`<ul class="checklist">${s.items.map((item) => html`<li><label class="check-row">
          <input type="checkbox" checked=${!!sec(s.id).checked?.[item]} onChange=${(e) => setSec(s.id, { checked: { ...sec(s.id).checked, [item]: e.currentTarget.checked } })} />
          ${item}</label></li>`)}</ul>`}
      <${Field} label="Notes" id=${'on-' + s.id}><textarea id=${'on-' + s.id} rows="2" value=${sec(s.id).notes || ''} onChange=${(e) => setSec(s.id, { notes: e.currentTarget.value })}></textarea><//>
    <//>`)}
    <div class="row between">
      ${log.completedAt ? html`<p class="calm">Check finished.</p>` : html`<button class="btn" onClick=${() => { save({ completedAt: Date.now() }); toast('Office check finished'); }}>Finish check</button>`}
      <button class="link-btn" onClick=${() => openSheet('Edit checklist', TemplateEditor)}>Edit checklist</button>
    </div>
    ${history.length > 0 && html`<${Card} title="Earlier checks"><ul class="plain">${history.map((h) => html`<li><button class="link-btn" onClick=${() => { setDate(h.date); setSlot(h.slot); }}>
      ${relDate(h.date, today)} · ${h.slot === 'morning' ? 'Morning' : 'Closing'}${h.completedAt ? '' : ' (not finished)'}</button></li>`)}</ul><//>`}
  </div>`;
}

function Decisions({ items, onChange }) {
  const [d, setD] = useState({ decision: '', owner: '', nextAction: '' });
  const add = (e) => {
    e.preventDefault();
    if (!d.decision.trim()) return;
    onChange([...items, { ...d, id: M.uid() }]);
    setD({ decision: '', owner: '', nextAction: '' });
  };
  const toTask = (x) => {
    const t = M.createTask({ title: x.decision, nextAction: x.nextAction, owner: x.owner, category: 'Sitz Ergo', plannedDate: M.today() });
    onChange(items.map((i) => (i.id === x.id ? { ...i, taskId: t.id } : i)));
    toast('Added to today’s tasks');
  };
  return html`<div class="stack">
    ${items.length > 0 && html`<ul class="plain decisions">${items.map((x) => html`<li key=${x.id}>
      <strong>${x.decision}</strong>
      <span class="task-meta">${[x.owner && `Owner: ${x.owner}`, x.nextAction && `Next: ${x.nextAction}`].filter(Boolean).join(' · ')}</span>
      ${x.taskId ? html`<span class="hint">Added as a task</span>` : html`<button class="link-btn" onClick=${() => toTask(x)}>Create a task from this</button>`}
    </li>`)}</ul>`}
    <form class="stack" onSubmit=${add}>
      <input aria-label="Decision" placeholder="Decision" value=${d.decision} onInput=${(e) => setD({ ...d, decision: e.currentTarget.value })} />
      <div class="row">
        <input aria-label="Owner" placeholder="Owner" value=${d.owner} onInput=${(e) => setD({ ...d, owner: e.currentTarget.value })} />
        <input aria-label="Next action" placeholder="Next action" value=${d.nextAction} onInput=${(e) => setD({ ...d, nextAction: e.currentTarget.value })} />
      </div>
      <button class="btn small secondary" type="submit" disabled=${!d.decision.trim()}>Add decision</button>
    </form>
  </div>`;
}
