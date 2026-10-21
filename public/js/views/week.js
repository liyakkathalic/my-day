import { html, useState } from '../../vendor/preact-htm.js';
import { useStore, TaskRow, SyncPill, openSheet, TaskEditor } from '../ui.js';
import * as M from '../model.js';
import { startOfWeek, addDays, fmtDate, fmtTime, weekdayOf } from '../core/time.js';
import { blocksForDate, adminThemeFor } from '../core/schedule.js';

function DayCard({ date, today, open, onToggle }) {
  const sched = M.schedule();
  const tasks = M.tasks();
  const planned = tasks.filter((t) => t.plannedDate === date && (t.status === 'open' || t.status === 'done') && !(t.seriesId && date < today && t.status !== 'done'));
  const deadlines = tasks.filter((t) => t.dueDate === date && t.status !== 'done' && t.status !== 'skipped');
  const follow = tasks.filter((t) => t.status === 'waiting' && t.followUpDate === date);
  const theme = adminThemeFor(sched, date);
  const blocks = blocksForDate(sched.blocks, date);
  const hasLive = blocks.some((b) => b.kind === 'live');
  const isToday = date === today;
  const openCount = planned.filter((t) => t.status === 'open').length;

  return html`<section class=${'card day' + (isToday ? ' is-today' : '')}>
    <button class="day-head" onClick=${onToggle} aria-expanded=${open}>
      <span class="day-name">${isToday ? 'Today · ' : ''}${fmtDate(date)}</span>
      <span class="day-sum">${[openCount ? `${openCount} planned` : '', deadlines.length ? `${deadlines.length} deadline${deadlines.length > 1 ? 's' : ''}` : '', hasLive ? 'Live session' : ''].filter(Boolean).join(' · ') || 'Nothing planned'}</span>
    </button>
    ${theme && html`<p class="theme">Admin theme: ${theme}</p>`}
    ${open && html`<div class="day-body">
      ${deadlines.length > 0 && html`<p class="eyebrow">Deadlines</p><ul class="task-list">${deadlines.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} />`)}</ul>`}
      ${follow.length > 0 && html`<p class="eyebrow">Follow-ups</p><ul class="task-list">${follow.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} />`)}</ul>`}
      <p class="eyebrow">Planned</p>
      ${planned.length ? html`<ul class="task-list">${planned.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} />`)}</ul>` : html`<p class="empty">Nothing planned.</p>`}
      <button class="link-btn" onClick=${() => openSheet('New task', TaskEditor, { defaults: { plannedDate: date } })}>+ Plan something for this day</button>
      <details class="blocks">
        <summary>Schedule (${blocks.length} blocks)</summary>
        <ul>${blocks.map((b) => html`<li><span class="b-time">${fmtTime(b.start)}${b.end ? `–${fmtTime(b.end)}` : ''}</span><span>${b.title}</span></li>`)}</ul>
        <a class="link-btn" href=${`#more/schedule/${weekdayOf(date)}`}>Edit this day’s schedule</a>
      </details>
    </div>`}
  </section>`;
}

export function WeekView() {
  useStore();
  const today = M.today();
  const [offset, setOffset] = useState(0);
  const [openDay, setOpenDay] = useState(today);
  const start = addDays(startOfWeek(today), offset * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return html`<div class="screen">
    <header class="top"><h1>Week</h1><${SyncPill} /></header>
    <div class="row between week-nav">
      <button class="btn secondary small" onClick=${() => setOffset(offset - 1)} aria-label="Previous week">‹ Previous</button>
      <span class="week-label">${offset === 0 ? 'This week' : `${fmtDate(days[0])} – ${fmtDate(days[6])}`}</span>
      <button class="btn secondary small" onClick=${() => setOffset(offset + 1)} aria-label="Next week">Next ›</button>
    </div>
    ${offset !== 0 && html`<button class="link-btn" onClick=${() => setOffset(0)}>Back to this week</button>`}
    ${days.map((d) => html`<${DayCard} key=${d} date=${d} today=${today} open=${openDay === d} onToggle=${() => setOpenDay(openDay === d ? null : d)} />`)}
  </div>`;
}
