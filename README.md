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

## Two editions

| | Cloudflare (live sync) | GitHub Pages | Web app (claude.ai) | Self-hosted |
|---|---|---|---|---|
| Address | `https://my-day.<account>.workers.dev` | `https://<user>.github.io/my-day/` | Private claude.ai link | Your own domain |
| Data | Cloudflare D1 `my-day` + device | This device only (+ backup files) | Your claude.ai account (private) + device | Your server + device + daily backups |
| Same data on phone and computer | Yes, live (checks every 4 s while open) | No (move with backup files) | Yes | Yes |
| Phone notifications with app closed | Not yet (shown while open) | No (shown while open) | No (shown while open) | Yes (Web Push) |
| Works offline / Home Screen install | Yes | Yes | Only while open | Yes |
| Build | `npm run build:cloud` → `dist-cloud/`, deployed by Cloudflare Workers Builds on push | `npm run build:pages` → `dist-pages/` (automatic on push, see `.github/workflows/pages.yml`) | `npm run build:web` | `npm start` |

All four come from the same code; `MYDAY_MODE` (see `public/js/config.js`) switches the storage.

### Cloudflare edition (live sync)

Same pattern as Sitz Ergo Job Desk: a Cloudflare Worker (`worker/index.js`) serves the app
from `dist-cloud/` and the sync API from D1 (`worker/schema.sql`, database `my-day`, id in
`wrangler.toml`). Devices check for changes every 4 seconds while open.

* Deploy: Cloudflare → Workers & Pages → Create → Import a repository → `my-day`. The deploy
  command `npx wrangler deploy` runs `npm run build:cloud` first (`[build]` in wrangler.toml).
* First sign-in: More → Sign-in and sync → Create your password, with the one-time setup code
  stored (hashed) in the `meta` table as `setup_code`. To issue a new code, store the SHA-256 of
  the upper-case code there and delete the `password` row.
* Local: `npm run dev:cloud` (local D1: `npx wrangler d1 execute my-day --local --file worker/schema.sql`).
* Tests: `npm run build:cloud && node test/cloud.mjs` (real Worker under `wrangler dev`, two browsers).

### Publishing on GitHub Pages

Live at **https://liyakkathalic.github.io/my-day/**. Every push to `main` runs the
tests, builds `dist-pages/` and force-pushes it to the `gh-pages` branch
(`.github/workflows/pages.yml`). Repository → Settings → Pages must be set to
**Deploy from a branch → gh-pages → / (root)**.

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
npm run build:web && node test/web-app.mjs   # web-app edition with a stand-in claude.ai runtime
npm run build:pages && node test/pages.mjs   # GitHub Pages edition served under /my-day/
npm run build:cloud && node test/cloud.mjs   # Cloudflare edition: local Worker + D1, two devices
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
