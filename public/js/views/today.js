import { html, useState, useEffect } from '../../vendor/preact-htm.js';
import { useStore, useClock, Card, TaskList, TaskRow, EmptyState, openSheet, QuickCapture, TaskEditor, toast, SyncPill, Field, DateQuick } from '../ui.js';
import * as M from '../model.js';
import { currentAndNext, minutesLeft, adminThemeFor } from '../core/schedule.js';
import { tasksForList, priorities, upcomingDeadlines, deadlineLabel, followUpDue } from '../core/tasks.js';
import { fmtTime, fmtDate, addDays, relDate, toMinutes, nowMinutes } from '../core/time.js';
import { MONEY_TYPES } from '../core/defaults.js';
import { builtInQuote } from '../core/quotes.js';
import { cachedQuote, loadQuote } from '../quote.js';
import { IS_CLOUD } from '../config.js';
import { syncState } from '../store.js';

function QuoteBanner({ today }) {
  const [quote, setQuote] = useState(() => cachedQuote(today) || builtInQuote(today));
  useEffect(() => { let live = true; loadQuote(today).then((x) => live && setQuote(x)); return () => { live = false; }; }, [today]);
  return html`<figure class="quote" aria-label="Today’s quote">
    <span class="quote-mark" aria-hidden="true">“</span>
    <blockquote>${quote.q}</blockquote>
    <figcaption>— ${quote.a}${quote.source === 'zenquotes' && html` · <a href="https://zenquotes.io/" target="_blank" rel="noopener">ZenQuotes</a>`}</figcaption>
  </figure>`;
}

function greeting(min) {
  if (min >= 300 && min < 720) return 'Good morning';
  if (min >= 720 && min < 1020) return 'Good afternoon';
  if (min >= 1020 && min < 1320) return 'Good evening';
  return 'Rest well';
}

function duration(min) {
  if (min == null) return '';
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
}

function NowCard({ now }) {
  const sched = M.schedule();
  const { current, next, minutes } = currentAndNext(sched.blocks, new Date(now), M.tz());
  const theme = (b) => (b?.link === 'admin' ? adminThemeFor(sched, b.date) : '');
  const isSleep = current?.kind === 'sleep';
  const left = minutesLeft(current, minutes);
  let total = current?.end ? toMinutes(current.end) - toMinutes(current.start) : 0;
  if (total <= 0) total += 1440;
  const pct = current?.end && left != null ? Math.min(100, Math.max(0, Math.round((1 - left / total) * 100))) : null;
  return html`<section class=${'card now' + (isSleep ? ' sleep' : '')} aria-label="Current time block">
    <p class="eyebrow">Now · ${fmtTime(String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0'))}</p>
    ${current ? html`
      <h2 class="now-title">${current.title}</h2>
      ${theme(current) && html`<p class="theme">Today’s theme: ${theme(current)}</p>`}
      <p class="muted">${fmtTime(current.start)}–${fmtTime(current.end)} · ${duration(left)} left</p>
      ${pct != null && html`<div class="progress" role="progressbar" aria-label="Time block progress" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100"><span style=${`width:${pct}%`}></span></div>`}
      ${isSleep && html`<p class="calm">Rest. Everything else can wait until morning.</p>`}
      ${current.link === 'office' && html`<a class="btn secondary" href="#more/office">Open office checklist</a>`}
    ` : html`<h2 class="now-title">Open time</h2><p class="muted">Nothing scheduled right now.</p>`}
    ${next && html`<div class="next">
      <span class="eyebrow">Next</span>
      <span><strong>${fmtTime(next.start)}</strong>${next.date !== M.today() ? ` (${relDate(next.date, M.today())})` : ''} · ${next.title}${theme(next) ? ` — ${theme(next)}` : ''}</span>
    </div>`}
  </section>`;
}

function PriorityPicker({ close }) {
  useStore();
  const t0 = M.today();
  const [title, setTitle] = useState('');
  const candidates = M.tasks().filter((t) => t.status === 'open' && t.priorityDate !== t0 && (!t.plannedDate || t.plannedDate <= addDays(t0, 7)))
    .sort((a, b) => (a.plannedDate || '9').localeCompare(b.plannedDate || '9'));
  const pick = (t) => { M.setPriority(t, true); close(); toast('Added to today’s priorities'); };
  const add = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const t = M.createTask({ title: title.trim(), plannedDate: t0 });
    M.setPriority(t, true);
    close();
  };
  return html`<div class="stack">
    <form class="row" onSubmit=${add}>
      <input aria-label="New priority" data-autofocus placeholder="Type a new priority" value=${title} onInput=${(e) => setTitle(e.currentTarget.value)} />
      <button class="btn" type="submit" disabled=${!title.trim()}>Add</button>
    </form>
    ${candidates.length ? html`<p class="muted">Or choose an existing task:</p>
      <ul class="pick-list">${candidates.slice(0, 30).map((t) => html`<li><button onClick=${() => pick(t)}>
        <span>${t.title}</span><span class="task-meta">${[t.category, t.plannedDate && relDate(t.plannedDate, t0)].filter(Boolean).join(' · ')}</span></button></li>`)}</ul>`
      : html`<${EmptyState}>No other open tasks for this week.<//>`}
  </div>`;
}

function FollowUps({ items, today }) {
  if (!items.length) return null;
  const snooze = (t) => openSheet('Next follow-up', SnoozeFollowUp, { task: t });
  return html`<${Card} title="Follow up today">
    <ul class="task-list">${items.map((t) => html`<li class="task" key=${t.id}>
      <div class="task-main"><div class="task-text static">
        <span class="task-title">${t.title}</span>
        <span class="task-meta">Waiting for ${t.waitingFor || 'someone'}${t.lastContact ? ` · last contact ${relDate(t.lastContact, today)}` : ''}</span>
      </div></div>
      <div class="task-actions">
        <button class="btn small secondary" onClick=${() => snooze(t)}>Still waiting</button>
        <button class="btn small secondary" onClick=${() => { M.resumeTask(t); toast('Back on today’s list'); }}>Ready to act</button>
        <button class="btn small secondary" onClick=${() => { M.completeTask(t); toast('Marked as done'); }}>Done</button>
      </div>
    </li>`)}</ul>
  <//>`;
}

function SnoozeFollowUp({ task, close }) {
  const t0 = M.today();
  const [d, setD] = useState(addDays(t0, 3));
  return html`<div class="stack">
    <${Field} label="Follow up again on" id="sn-d"><${DateQuick} id="sn-d" value=${d} onChange=${setD} includeNone=${false} label="Follow-up date" /><//>
    <div class="sheet-actions"><button class="btn" onClick=${() => { M.saveTask({ ...task, lastContact: t0, followUpDate: d }); close(); toast(`Next follow-up ${relDate(d, t0)}`); }}>Save</button></div>
  </div>`;
}

function Deadlines({ today }) {
  const tasks = upcomingDeadlines(M.tasks(), today).map((t) => ({ kind: 'task', id: t.id, title: t.title, date: t.dueDate, t }));
  const money = M.moneyEntries().filter((e) => (e.type === 'payable' || e.type === 'receivable') && e.status !== 'paid' && e.dueDate && e.dueDate <= addDays(today, 14))
    .map((e) => ({ kind: 'money', id: e.id, title: `${MONEY_TYPES[e.type]}: ${e.party || e.title || ''}`.trim(), date: e.dueDate }));
  const all = [...tasks, ...money].sort((a, b) => a.date.localeCompare(b.date));
  return html`<${Card} title="Upcoming deadlines">
    ${all.length ? html`<ul class="deadlines">${all.map((d) => html`<li key=${d.kind + d.id}>
      ${d.kind === 'task'
        ? html`<button class="dl" onClick=${() => openSheet('Edit', TaskEditor, { task: d.t })}><span class="dl-title">${d.title}</span><span class=${'dl-when' + (d.date < today ? ' passed' : '')}>${deadlineLabel(d.date, today)} · ${fmtDate(d.date)}</span></button>`
        : html`<a class="dl" href="#more/money"><span class="dl-title">${d.title}</span><span class=${'dl-when' + (d.date < today ? ' passed' : '')}>${deadlineLabel(d.date, today)} · ${fmtDate(d.date)}</span></a>`}
    </li>`)}</ul>` : html`<${EmptyState}>No confirmed deadlines in the next two weeks.<//>`}
  <//>`;
}

export function TodayView() {
  useStore();
  const now = useClock();
  const today = M.today();
  const all = M.tasks();
  const prios = priorities(all, today);
  const openPrios = prios.filter((t) => t.status === 'open');
  const rest = tasksForList(all, 'today', today).filter((t) => t.priorityDate !== today);
  const follow = all.filter((t) => followUpDue(t, today));
  const [showAll, setShowAll] = useState(false);
  const visibleRest = showAll ? rest : rest.slice(0, 6);

  return html`<div class="screen">
    <${QuoteBanner} today=${today} />
    <header class="top">
      <div><p class="eyebrow">${greeting(nowMinutes(M.tz(), new Date(now)))} · Today</p><h1 class="hero">${fmtDate(today, { long: true })}</h1></div>
      <${SyncPill} />
    </header>
    ${IS_CLOUD && !syncState().signedIn && html`<a class="card attn signin-nudge" href="#more/sync"><strong>${syncState().passwordSet ? 'Sign in to sync' : 'Set up your password'}</strong><span>Until then, changes stay on this device only.</span></a>`}
    <${NowCard} now=${now} />
    <${Card} title="Today’s three priorities">
      <ul class="task-list prio">
        ${prios.map((t) => html`<${TaskRow} key=${t.id} task=${t} today=${today} actions=${true} />`)}
        ${openPrios.length < 3 && html`<li><button class="slot" onClick=${() => openSheet('Choose a priority', PriorityPicker)}>+ Choose ${prios.length ? 'another' : 'a'} priority</button></li>`}
      </ul>
    <//>
    <${FollowUps} items=${follow} today=${today} />
    <${Deadlines} today=${today} />
    <${Card} title="Also today" action=${html`<a class="link-btn" href="#tasks/today">All tasks</a>`}>
      <${TaskList} items=${visibleRest} today=${today} empty="Nothing else planned for today." />
      ${rest.length > 6 && html`<button class="link-btn more" onClick=${() => setShowAll(!showAll)}>${showAll ? 'Show fewer' : `Show ${rest.length - 6} more`}</button>`}
    <//>
    <button class="fab" onClick=${() => openSheet('Quick capture', QuickCapture)} aria-label="Quick capture">
      <span aria-hidden="true">＋</span> Capture
    </button>
  </div>`;
}
