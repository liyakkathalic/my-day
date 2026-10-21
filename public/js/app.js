import { html, render, useState, useEffect } from '../vendor/preact-htm.js';
import * as store from './store.js';
import * as M from './model.js';
import { SheetHost, ToastHost, useStore, toast } from './ui.js';
import { TodayView } from './views/today.js';
import { TasksView } from './views/tasks.js';
import { WeekView } from './views/week.js';
import { MoreView } from './views/more.js';
import { ScheduleView, ThemesView } from './views/schedule.js';
import { RoutinesView } from './views/routines.js';
import { NotificationsView } from './views/notifications.js';
import { SyncView, DataView } from './views/data.js';
import { SettingsView, InstallView } from './views/settings.js';
import { OfficeView } from './views/office.js';
import { ContentView } from './views/content.js';
import { MoneyView } from './views/money.js';
import { repairSubscription } from './push-client.js';
import { IS_ARTIFACT, IS_LOCAL, NO_PUSH } from './config.js';
import { dueReminders, reminderText } from './core/reminders.js';
import { nowMinutes } from './core/time.js';

const MORE = {
  schedule: ScheduleView, themes: ThemesView, routines: RoutinesView, notifications: NotificationsView,
  sync: SyncView, data: DataView, settings: SettingsView, install: InstallView,
  office: OfficeView, content: ContentView, money: MoneyView,
};

function parseHash() {
  const [tab = 'today', page, sub] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  return { tab: ['today', 'tasks', 'money', 'week', 'more'].includes(tab) ? tab : 'today', page, sub };
}

function useRoute() {
  const [r, setR] = useState(parseHash());
  useEffect(() => {
    const on = () => { setR(parseHash()); window.scrollTo(0, 0); };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return r;
}

const ICONS = {
  today: html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>`,
  tasks: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5l1.8 1.8L9 5M4 12.5l1.8 1.8L9 11M4 18.5l1.8 1.8L9 17M12 7h8M12 13h8M12 19h8"/></svg>`,
  money: html`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.8" y="6" width="18.4" height="13" rx="3"/><path d="M2.8 10h18.4M16 14.5h2.2"/><path d="M6 6l8.5-3 1.4 3"/></svg>`,
  week: html`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>`,
  more: html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/></svg>`,
};

function BottomNav({ tab }) {
  return html`<nav class="bottom-nav" aria-label="Main">
    ${[['today', 'Today'], ['tasks', 'Tasks'], ['money', 'Money'], ['week', 'Week'], ['more', 'More']].map(([id, label]) => html`
      <a href=${'#' + id} class=${tab === id ? 'on' : ''} aria-current=${tab === id ? 'page' : undefined}>${ICONS[id]}<span>${label}</span></a>`)}
  </nav>`;
}

function ConflictBanner({ hidden }) {
  useStore();
  const n = store.syncState().conflicts;
  if (!n || hidden) return null;
  return html`<a class="banner" href="#more/sync">${n} item${n > 1 ? 's were' : ' was'} changed on another device. Tap to choose which version to keep.</a>`;
}

function App() {
  const { tab, page, sub } = useRoute();
  const go = (h) => { location.hash = h; };
  let view;
  if (tab === 'today') view = html`<${TodayView} />`;
  else if (tab === 'tasks') view = html`<${TasksView} sub=${page} cat=${sub} go=${go} />`;
  else if (tab === 'week') view = html`<${WeekView} />`;
  else if (tab === 'money') view = html`<${MoneyView} asTab=${true} />`;
  else if (MORE[page]) { const V = MORE[page]; view = html`<${V} sub=${sub} />`; }
  else view = html`<${MoreView} />`;
  return html`
    <div class="sky" aria-hidden="true"><i></i><i></i><i></i></div>
    <${ConflictBanner} hidden=${page === 'sync'} />
    <main id="main">${view}</main>
    <${BottomNav} tab=${tab} />
    <${SheetHost} />
    <${ToastHost} />`;
}

// Background colours follow the time of day in the planning time zone.
function daypart(min) {
  if (min >= 300 && min < 540) return 'dawn';
  if (min >= 540 && min < 960) return 'day';
  if (min >= 960 && min < 1170) return 'evening';
  return 'night';
}
function trackDaypart() {
  const set = () => { document.documentElement.dataset.daypart = daypart(nowMinutes(M.tz())); };
  set();
  setInterval(set, 60_000);
}

// Keep sheets and buttons above the on-screen keyboard (iOS does not resize the layout viewport).
function trackViewport() {
  const vv = window.visualViewport;
  if (!vv) return;
  const update = () => {
    const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty('--kb', `${Math.round(kb)}px`);
    document.documentElement.style.setProperty('--vvh', `${Math.round(vv.height)}px`);
    document.body.classList.toggle('kb-open', kb > 80);
  };
  vv.addEventListener('resize', update);
  vv.addEventListener('scroll', update);
  update();
  document.addEventListener('focusin', (e) => {
    if (e.target.matches('input, textarea, select')) setTimeout(() => e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
  });
}

// Web-app edition only: show reminders inside the page while it is open.
function inPageReminders() {
  let last = Date.now();
  setInterval(() => {
    const now = Date.now();
    const due = dueReminders({ reminders: M.reminders(), tasks: M.tasks(), settings: M.settings() }, last, now);
    last = now;
    if (due.length) toast(reminderText(due[due.length - 1].textKey));
  }, 20_000);
}

function registerServiceWorker() {
  if (IS_ARTIFACT || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').then((reg) => {
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) {
          toast('A new version is ready.', { label: 'Update', run: () => w.postMessage('skipWaiting') });
        }
      });
    });
  }).catch(() => {});
  // Reload only when an update replaces a running version, never on first install.
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !reloaded) { reloaded = true; store.flushWrites().finally(() => location.reload()); }
  });
}

async function boot() {
  const root = document.getElementById('app');
  try {
    await store.init();
  } catch (e) {
    root.innerHTML = '<p class="boot-error">This browser is blocking local storage (private browsing?). My Day needs it to work offline.</p>';
    return;
  }
  // Get the cloud copy first (briefly) so defaults never fight with real data.
  if (IS_ARTIFACT) await store.cloudReady;
  else if (store.syncState().signedIn && navigator.onLine) await Promise.race([store.sync(), new Promise((r) => setTimeout(r, 4000))]);
  M.ensureDefaults();
  M.materializeRoutines();
  trackViewport();
  trackDaypart();
  root.textContent = '';
  render(html`<${App} />`, root);
  registerServiceWorker();
  if (NO_PUSH) inPageReminders();
  else if (store.syncState().signedIn) repairSubscription();
  // New day while the app stays open: create today's routine tasks.
  let day = M.today();
  setInterval(() => { if (M.today() !== day) { day = M.today(); M.materializeRoutines(); } }, 60_000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) M.materializeRoutines(); });
}

boot();
