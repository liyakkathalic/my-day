import { html } from '../../vendor/preact-htm.js';
import { useStore, TaskList, openSheet, TaskEditor, Chips, categoryOptions, SyncPill } from '../ui.js';
import * as M from '../model.js';
import { tasksForList, LISTS, LIST_LABELS } from '../core/tasks.js';

const EMPTY = {
  today: 'Nothing planned for today. Use Capture or add a task.',
  week: 'Nothing else planned for this week.',
  waiting: 'You are not waiting on anyone.',
  later: 'No “someday” items.',
  completed: 'Completed tasks will appear here.',
};

export function TasksView({ sub, cat, go }) {
  useStore();
  const list = LISTS.includes(sub) ? sub : 'today';
  const today = M.today();
  const all = M.tasks();
  let items = tasksForList(all, list, today);
  if (cat) items = items.filter((t) => t.category === cat);
  if (list === 'completed') items = items.slice(0, 100);
  const counts = Object.fromEntries(LISTS.map((l) => [l, tasksForList(all, l, today).length]));
  const setCat = (c) => go(`#tasks/${list}${c ? '/' + encodeURIComponent(c) : ''}`);

  return html`<div class="screen">
    <header class="top"><h1>Tasks</h1><${SyncPill} /></header>
    <nav class="tabs" aria-label="Task lists">
      ${LISTS.map((l) => html`<a href=${`#tasks/${l}${cat ? '/' + encodeURIComponent(cat) : ''}`} class=${l === list ? 'on' : ''} aria-current=${l === list ? 'page' : undefined}>
        ${LIST_LABELS[l]}${l !== 'completed' && counts[l] ? html` <span class="count">${counts[l]}</span>` : ''}</a>`)}
    </nav>
    <${Chips} label="Filter by category" options=${categoryOptions()} value=${cat || ''} onChange=${setCat} />
    <div class="row between">
      <button class="btn" onClick=${() => openSheet('New task', TaskEditor, { defaults: list === 'later' ? { status: 'later', plannedDate: '' } : list === 'waiting' ? { status: 'waiting' } : {} })}>+ New task</button>
      <a class="link-btn" href="#more/routines">Routines</a>
    </div>
    ${list === 'waiting' && html`<p class="hint">Waiting items stay here quietly and only come back to Today on their follow-up date.</p>`}
    <${TaskList} items=${items} today=${today} empty=${cat ? `No ${cat} items in this list.` : EMPTY[list]} />
  </div>`;
}
