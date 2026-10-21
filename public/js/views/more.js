import { html } from '../../vendor/preact-htm.js';
import { useStore, SyncPill, syncLabel } from '../ui.js';
import * as store from '../store.js';
import { IS_ARTIFACT, IS_LOCAL, IS_CLOUD } from '../config.js';

const I = (d) => html`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON = {
  office: I(html`<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>`),
  content: I(html`<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/>`),
  money: I(html`<rect x="2.8" y="6" width="18.4" height="13" rx="3"/><path d="M2.8 10h18.4M16 14.5h2.2"/>`),
  routines: I(html`<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>`),
  schedule: I(html`<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`),
  themes: I(html`<path d="M4 6.5h16M4 12h10M4 17.5h13"/><circle cx="19" cy="12" r="1.6"/>`),
  notifications: I(html`<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4"/>`),
  install: I(html`<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3M10.5 18.5h3"/>`),
  settings: I(html`<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>`),
  sync: I(html`<path d="M7 18.5h10a4.5 4.5 0 0 0 .6-9A6 6 0 0 0 6 9.8a4.4 4.4 0 0 0 1 8.7z"/>`),
  data: I(html`<rect x="3.5" y="4" width="17" height="5" rx="1.5"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>`),
};
// [id, title, short description, hue of the tile]
const ITEMS = [
  ['Plan', [
    ['office', 'Office check', 'Daily 30 minutes', 205],
    ['content', 'Content', 'Ideas to published', 335],
    ['money', 'Money', 'Spending & payments', 150],
    ['routines', 'Routines', 'Repeating tasks', 265],
  ]],
  ['Set up', [
    ['schedule', 'Schedule', 'Time blocks', 25],
    ['themes', 'Admin themes', 'One per weekday', 45],
    ['notifications', 'Reminders', 'Office, shutdown, review', 5],
    ['install', 'Home Screen', IS_ARTIFACT ? 'Open like an app' : 'Install on iPhone', 185],
    ['settings', 'Settings', 'Time zone, quiet hours', 230],
  ]],
  ['Your data', [
    ['sync', IS_LOCAL ? 'Saved where' : IS_ARTIFACT ? 'Cloud copy' : 'Sign-in & sync', null, 215],
    ['data', 'Backup', 'Export or restore', 290],
  ]],
];

export function MoreView() {
  useStore();
  const s = syncLabel(store.syncState());
  return html`<div class="screen">
    <header class="top"><h1>More</h1><${SyncPill} /></header>
    ${ITEMS.map(([group, items]) => html`<section class="menu-group" aria-label=${group}>
      <h2 class="eyebrow">${group}</h2>
      <ul class="tile-grid">${items.map(([id, title, desc, hue]) => html`<li><a class="tile" href=${id === 'money' ? '#money' : `#more/${id}`} style=${`--h:${hue}`}>
        <span class="tile-icon">${ICON[id]}</span>
        <span class="menu-title">${title}</span><span class="menu-desc">${desc || s.text}</span>
      </a></li>`)}</ul>
    </section>`)}
    <p class="hint center">My Day · version 0.2${IS_ARTIFACT ? ' · web app' : IS_LOCAL ? ' · device edition' : IS_CLOUD ? ' · live sync' : ''} · Private, single-user</p>
  </div>`;
}

export function SubHeader({ title, back = '#more' }) {
  return html`<header class="top sub">
    <a class="back" href=${back} aria-label="Back">‹ Back</a>
    <h1>${title}</h1>
  </header>`;
}
