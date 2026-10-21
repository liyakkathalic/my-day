import { html, useState } from '../../vendor/preact-htm.js';
import { useStore, openSheet, Field, Chips, categoryOptions, Segmented, toast, EmptyState } from '../ui.js';
import { SubHeader } from './more.js';
import * as M from '../model.js';
import { weekdayName, fmtTime, fmtDate } from '../core/time.js';
import { seriesDays } from '../core/recurrence.js';

const ORDER = [1, 2, 3, 4, 5, 6, 0];
const freqLabel = (s) => (s.freq === 'daily' ? 'Every day' : s.freq === 'weekdays' ? 'Monday–Friday' : ORDER.filter((d) => seriesDays(s).includes(d)).map((d) => weekdayName(d, true)).join(', '));

function RoutineEditor({ series, close }) {
  const isNew = !series;
  const [s, setS] = useState(() => series ? { ...series } : { id: M.uid(), title: '', freq: 'daily', days: [], startDate: M.today(), active: true });
  const set = (k, v) => setS((x) => ({ ...x, [k]: v }));
  const valid = s.title.trim() && (s.freq !== 'weekly' || s.days?.length);
  const save = (e) => {
    e.preventDefault();
    if (!valid) return;
    M.saveSeries({ ...s, title: s.title.trim() });
    close();
    toast(isNew ? 'Routine added' : 'Routine updated');
  };
  const stop = () => {
    if (!confirm('Stop this routine? Days already done stay in your history.')) return;
    M.endSeries(series);
    close();
    toast('Routine stopped');
  };
  return html`<form class="stack" onSubmit=${save}>
    ${!isNew && html`<p class="note">Changes apply from today onward. Days you completed, or changed one at a time, are not touched.</p>`}
    <${Field} label="Title" id="re-title"><input id="re-title" data-autofocus=${isNew} value=${s.title} onInput=${(e) => set('title', e.currentTarget.value)} /><//>
    <${Field} label="Next action (optional)" id="re-next"><input id="re-next" value=${s.nextAction || ''} onInput=${(e) => set('nextAction', e.currentTarget.value)} /><//>
    <div class="field"><span class="field-label">Category</span><${Chips} label="Category" options=${categoryOptions()} value=${s.category || ''} onChange=${(v) => set('category', v)} /></div>
    <div class="field"><span class="field-label">Repeats</span>
      <${Segmented} label="Repeats" value=${s.freq} onChange=${(v) => set('freq', v)} options=${[['daily', 'Every day'], ['weekdays', 'Mon–Fri'], ['weekly', 'Pick days']]} /></div>
    ${s.freq === 'weekly' && html`<div class="chips" role="group" aria-label="Days">${ORDER.map((d) => html`<button type="button" class=${'chip' + (s.days?.includes(d) ? ' on' : '')} aria-pressed=${!!s.days?.includes(d)}
      onClick=${() => set('days', s.days?.includes(d) ? s.days.filter((x) => x !== d) : [...(s.days || []), d])}>${weekdayName(d, true)}</button>`)}</div>`}
    <${Field} label="Starts on" id="re-start"><input id="re-start" type="date" value=${s.startDate} onInput=${(e) => set('startDate', e.currentTarget.value)} /><//>
    <${Field} label="Reminder time (optional)" id="re-rem" hint="Each day gets its own reminder. Completing one day cancels only that day’s reminder.">
      <input id="re-rem" type="time" value=${s.reminderTime || ''} onInput=${(e) => set('reminderTime', e.currentTarget.value)} />
    <//>
    <div class="sheet-actions">
      ${!isNew && s.active !== false && html`<button type="button" class="btn quiet" onClick=${stop}>Stop routine</button>`}
      <button class="btn" type="submit" disabled=${!valid}>Save</button>
    </div>
  </form>`;
}

export function RoutinesView() {
  useStore();
  const list = M.seriesList().sort((a, b) => (b.active !== false) - (a.active !== false) || a.title.localeCompare(b.title));
  return html`<div class="screen">
    <${SubHeader} title="Routines" />
    <p class="hint">Each day of a routine is a separate task. Finishing today does not finish tomorrow, and moving one day does not move the others.</p>
    <button class="btn" onClick=${() => openSheet('New routine', RoutineEditor)}>+ New routine</button>
    ${list.length ? html`<ul class="menu">${list.map((s) => html`<li key=${s.id}><button onClick=${() => openSheet('Edit routine', RoutineEditor, { series: s })}>
      <span class="menu-title">${s.title}${s.active === false ? ' (stopped)' : ''}</span>
      <span class="menu-desc">${[freqLabel(s), s.category, s.reminderTime && `Reminder ${fmtTime(s.reminderTime)}`, s.active === false && s.endDate && `Ended ${fmtDate(s.endDate)}`].filter(Boolean).join(' · ')}</span>
      <span class="chev" aria-hidden="true">›</span></button></li>`)}</ul>`
      : html`<${EmptyState}>No routines yet. Add things you do on a regular basis, like paying a monthly bill or checking stock.<//>`}
  </div>`;
}
