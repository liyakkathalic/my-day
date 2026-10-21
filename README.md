# My Day

A calm, private planning app for one person: today’s time blocks, three
priorities, tasks with real deadlines kept apart from planned dates, waiting
items, routines, office check, content pipeline, simple money notes and
genuine push reminders. Installable on iPhone as a Home Screen app and usable
offline.

* Plan, screen flow, stack and costs: [docs/PLAN.md](docs/PLAN.md)
* Deploying to a server with HTTPS: [docs/DEPLOY.md](docs/DEPLOY.md)
* iPhone set-up, real-device tests and the 7-day trial: [docs/IPHONE-TESTING.md](docs/IPHONE-TESTING.md)
* What is done and what is still unverified: [docs/STATUS.md](docs/STATUS.md)

## Run it on your computer (5 minutes)

Requires Node.js 22.13 or newer.

```bash
npm install
npm run set-password        # choose the sign-in password (10+ characters)
npm run dev                 # http://localhost:8080
```

`npm run dev` allows sign-in over plain `http://localhost`. On a real server
always use `npm start` behind HTTPS (see DEPLOY.md).

## Tests

```bash
npm test            # unit + server tests: time zone, schedule, recurrence, sync conflicts, reminder scheduler
npm run test:e2e    # simulated browser checks in headless Chromium at iPhone size
```

The browser checks are **simulations** (Chromium, not Safari, no real keyboard,
no Apple push). Real-device checks are listed in docs/IPHONE-TESTING.md.

## Project layout

```
public/              the app (served as-is, no build step)
  js/core/           shared rules used by app AND server: time zone, schedule,
                     recurrence, task lists, reminder timing, defaults
  js/store.js        offline storage (IndexedDB) + sync outbox + conflicts
  js/views/          screens
  sw.js              service worker: offline cache + notification display
server/
  index.js           HTTP server, API, security headers
  auth.js            single-user password sign-in
  sync.js            record-level sync with revisions
  push.js            Web Push (VAPID)
  scheduler.js       sends reminders every 30 s, each exactly once
  backup.js          daily database copies on the server
test/                unit, server and browser tests
```

## Data and privacy

* Data lives on your device (IndexedDB), on your server (SQLite) once signed in,
  in daily server backups (`data/backups/`, 14 days), and in backup files you export.
* Notifications only ever say generic things like “You have a reminder in My Day.”
* Server logs contain only method, path and status — never titles, notes or amounts.
* Pages send `noindex` and a strict Content Security Policy; there are no public pages with data.
