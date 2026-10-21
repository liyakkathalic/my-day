import { html, useState } from '../../vendor/preact-htm.js';
import { useStore, openSheet, Field, toast, Segmented } from '../ui.js';
import { SubHeader } from './more.js';
import * as M from '../model.js';
import { blocksForDate, findOverlaps } from '../core/schedule.js';
import { fmtTime, weekdayName, addDays, startOfWeek, isValidTime, toMinutes } from '../core/time.js';
import { defaultSchedule } from '../core/defaults.js';

const ORDER = [1, 2, 3, 4, 5, 6, 0];
const KINDS = [['routine', 'Personal routine'], ['office', 'Office check'], ['work', 'Content work'], ['admin', 'Administration'], ['break', 'Break'], ['family', 'Family'], ['live', 'Live'], ['buffer', 'Buffer'], ['review', 'Review'], ['marker', 'Single moment'], ['sleep', 'Sleep']];
const dateForWeekday = (wd) => addDays(startOfWeek(M.today()), ORDER.indexOf(wd));
const daysLabel = (days) => {
  const s = [...days].sort().join(',');
  if (s === '0,1,2,3,4,5,6') return 'Every day';
  if (s === '1,2,3,4,5') return 'Monday–Friday';
  if (s === '1,2,3,4,5,6') return 'Monday–Saturday';
  return ORDER.filter((d) => days.includes(d)).map((d) => weekdayName(d, true)).join(', ');
};

function BlockEditor({ block, weekday, close }) {
  const isNew = !block;
  const [b, setB] = useState(() => block ? { ...block, days: [...block.days] } : { id: M.uid(), title: '', start: '10:00', end: '11:00', days: [weekday], kind: 'work' });
  const [scope, setScope] = useState('all');
  const [moment, setMoment] = useState(block ? block.end == null : false);
  const shared = !isNew && block.days.length > 1;
  const set = (k, v) => setB((x) => ({ ...x, [k]: v }));
  const toggleDay = (d) => set('days', b.days.includes(d) ? b.days.filter((x) => x !== d) : [...b.days, d]);
  const valid = b.title.trim() && isValidTime(b.start) && (moment || isValidTime(b.end)) && (scope === 'one' || b.days.length);
  const crossesMidnight = !moment && isValidTime(b.end) && toMinutes(b.end) <= toMinutes(b.start);

  const save = (e) => {
    e.preventDefault();
    if (!valid) return;
    const s = M.schedule();
    const clean = { ...b, title: b.title.trim(), end: moment ? null : b.end, link: b.kind === 'office' ? 'office' : b.kind === 'admin' ? 'admin' : undefined };
    let blocks;
    if (isNew) blocks = [...s.blocks, clean];
    else if (shared && scope === 'one') {
      // Split: this weekday gets its own copy; the other days keep the original.
      blocks = s.blocks.map((x) => (x.id === block.id ? { ...x, days: x.days.filter((d) => d !== weekday) } : x));
      blocks.push({ ...clean, id: M.uid(), days: [weekday] });
    } else blocks = s.blocks.map((x) => (x.id === block.id ? clean : x));
    M.saveSchedule({ ...s, blocks: blocks.filter((x) => x.days.length) });
    close();
    toast('Schedule saved');
  };
  const del = () => {
    const s = M.schedule();
    const onlyHere = shared && scope === 'one';
    if (!confirm(onlyHere ? `Remove this block from ${weekdayName(weekday)} only?` : 'Delete this block from every day it appears on?')) return;
    const blocks = onlyHere
      ? s.blocks.map((x) => (x.id === block.id ? { ...x, days: x.days.filter((d) => d !== weekday) } : x))
      : s.blocks.filter((x) => x.id !== block.id);
    M.saveSchedule({ ...s, blocks });
    close();
    toast('Block removed');
  };

  return html`<form class="stack" onSubmit=${save}>
    ${shared && html`<div class="field"><span class="field-label">Apply changes to</span>
      <${Segmented} label="Apply changes to" value=${scope} onChange=${setScope}
        options=${[['all', daysLabel(block.days)], ['one', `Only ${weekdayName(weekday)}`]]} /></div>`}
    <${Field} label="Title" id="be-title"><input id="be-title" value=${b.title} onInput=${(e) => set('title', e.currentTarget.value)} data-autofocus=${isNew} /><//>
    <div class="row">
      <${Field} label="Start" id="be-start"><input id="be-start" type="time" value=${b.start} onInput=${(e) => set('start', e.currentTarget.value)} /><//>
      ${!moment && html`<${Field} label="End" id="be-end"><input id="be-end" type="time" value=${b.end || ''} onInput=${(e) => set('end', e.currentTarget.value)} /><//>`}
    </div>
    <label class="check-row"><input type="checkbox" checked=${moment} onChange=${(e) => setMoment(e.currentTarget.checked)} /> Single moment (no end time), like “Work shutdown”</label>
    ${crossesMidnight && html`<p class="hint">This block runs past midnight into the next morning.</p>`}
    <${Field} label="Type" id="be-kind"><select id="be-kind" value=${b.kind} onChange=${(e) => set('kind', e.currentTarget.value)}>${KINDS.map(([v, l]) => html`<option value=${v}>${l}</option>`)}</select><//>
    ${(!shared || scope === 'all') && html`<fieldset class="field"><legend class="field-label">Days</legend>
      <div class="chips">${ORDER.map((d) => html`<button type="button" class=${'chip' + (b.days.includes(d) ? ' on' : '')} aria-pressed=${b.days.includes(d)} onClick=${() => toggleDay(d)}>${weekdayName(d, true)}</button>`)}</div>
    </fieldset>`}
    <div class="sheet-actions">
      ${!isNew && html`<button type="button" class="btn quiet" onClick=${del}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!valid}>Save</button>
    </div>
  </form>`;
}

export function ScheduleView({ sub }) {
  useStore();
  const todayWd = new Date(M.today() + 'T12:00:00Z').getUTCDay();
  const wd = sub !== undefined && sub !== '' && !Number.isNaN(Number(sub)) ? Number(sub) : todayWd;
  const s = M.schedule();
  const date = dateForWeekday(wd);
  const blocks = blocksForDate(s.blocks, date);
  const overlaps = findOverlaps(s.blocks, date);
  const reset = () => {
    if (!confirm('Replace your whole schedule and themes with the original defaults?')) return;
    M.saveSchedule(defaultSchedule());
    toast('Default schedule restored');
  };
  return html`<div class="screen">
    <${SubHeader} title="Schedule" />
    <nav class="tabs days" aria-label="Day of week">
      ${ORDER.map((d) => html`<a href=${`#more/schedule/${d}`} class=${d === wd ? 'on' : ''} aria-current=${d === wd ? 'page' : undefined}>${weekdayName(d, true)}</a>`)}
    </nav>
    <p class="hint">Times are in ${M.tz()}. Tap a block to change it.</p>
    ${overlaps.length > 0 && html`<p class="note">Some blocks overlap on ${weekdayName(wd)}: ${overlaps.map(([a, c]) => `“${a.title}” and “${c.title}”`).join('; ')}. The later one is shown as current.</p>`}
    <ul class="block-list">
      ${blocks.map((b) => html`<li key=${b.id}><button class=${'block-row kind-' + b.kind} onClick=${() => openSheet('Edit block', BlockEditor, { block: b, weekday: wd })}>
        <span class="b-time">${fmtTime(b.start)}${b.end ? html`<br />${fmtTime(b.end)}` : ''}</span>
        <span class="b-main"><span class="b-title">${b.title}</span><span class="b-days">${daysLabel(b.days)}${b.link === 'admin' && s.themes[wd] ? ` · ${s.themes[wd]}` : ''}</span></span>
      </button></li>`)}
    </ul>
    <div class="row between">
      <button class="btn" onClick=${() => openSheet('New block', BlockEditor, { weekday: wd })}>+ Add block</button>
      <button class="btn quiet" onClick=${reset}>Reset to defaults</button>
    </div>
  </div>`;
}

export function ThemesView() {
  useStore();
  const s = M.schedule();
  const [themes, setThemes] = useState({ ...s.themes });
  const save = (e) => { e.preventDefault(); M.saveSchedule({ ...M.schedule(), themes }); toast('Themes saved'); };
  return html`<div class="screen">
    <${SubHeader} title="Administration themes" />
    <p class="hint">Shown during the daily administration block and in the Week view.</p>
    <form class="stack card" onSubmit=${save}>
      ${ORDER.map((d) => html`<${Field} label=${weekdayName(d)} id=${'th' + d}>
        <input id=${'th' + d} value=${themes[d] || ''} placeholder=${d === 0 || d === 6 ? 'No theme' : ''} onInput=${(e) => setThemes({ ...themes, [d]: e.currentTarget.value })} />
      <//>`)}
      <div class="sheet-actions"><button class="btn" type="submit">Save themes</button></div>
    </form>
  </div>`;
}
