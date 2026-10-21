import { html } from '../../vendor/preact-htm.js';
import { useStore, SyncPill, syncLabel } from '../ui.js';
import * as store from '../store.js';

const ITEMS = [
  ['Plan', [
    ['office', 'Office check', '30-minute checklist: brother, admin, my decisions'],
    ['content', 'Content', 'Ideas through to published'],
    ['money', 'Money', 'Simple manual tracking, personal and business'],
    ['routines', 'Routines', 'Things that repeat on certain days'],
  ]],
  ['Set up', [
    ['schedule', 'Schedule', 'Edit time blocks for each day'],
    ['themes', 'Administration themes', 'One theme per weekday'],
    ['notifications', 'Reminders and notifications', 'Office check, shutdown, weekly review'],
    ['install', 'Add to Home Screen', 'Install on iPhone'],
    ['settings', 'Settings', 'Time zone and quiet hours'],
  ]],
  ['Your data', [
    ['sync', 'Sign-in and sync', null],
    ['data', 'Backup and restore', 'Export a file or restore one'],
  ]],
];

export function MoreView() {
  useStore();
  const s = syncLabel(store.syncState());
  return html`<div class="screen">
    <header class="top"><h1>More</h1><${SyncPill} /></header>
    ${ITEMS.map(([group, items]) => html`<section class="menu-group" aria-label=${group}>
      <h2 class="eyebrow">${group}</h2>
      <ul class="menu">${items.map(([id, title, desc]) => html`<li><a href=${`#more/${id}`}>
        <span class="menu-title">${title}</span><span class="menu-desc">${desc || s.text}</span><span class="chev" aria-hidden="true">›</span>
      </a></li>`)}</ul>
    </section>`)}
    <p class="hint center">My Day · version 0.1 · Private, single-user</p>
  </div>`;
}

export function SubHeader({ title, back = '#more' }) {
  return html`<header class="top sub">
    <a class="back" href=${back} aria-label="Back">‹ Back</a>
    <h1>${title}</h1>
  </header>`;
}
