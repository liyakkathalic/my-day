# Status — what is done, what is verified, what is not

Legend: **Tested** = covered by automated tests that passed in this build environment.
**Simulated** = checked in headless Chromium at iPhone size (not Safari, not a real phone).
**Unverified** = built, but needs checking on your real iPhone / deployed server.

## Automated test results (this build)

* `npm test` — 18/18 passed (time zone, schedule, recurrence, task lists, reminders, server sync, scheduler)
* `npm run test:e2e` — 24/24 simulated checks passed (headless Chromium 440×956, 320×568, 1280×800)
* `node test/web-app.mjs` — 8/8 simulated web-app checks passed (stand-in claude.ai runtime)

## Web-app edition (claude.ai link)

| Feature | State |
|---|---|
| Same screens and rules as the self-hosted app | Built from the same code |
| Data saved to the person's private area of the claude.ai database, live across devices, conflicts never overwritten | Simulated with a stand-in runtime (8/8 checks) |
| Works without the cloud store (keeps data on the device, says so) | Simulated |
| In-app confirmations (browser dialogs are blocked there), export through the platform save prompt, copy backup | Simulated |
| Reminders shown only while the page is open; push when closed is **not available** in this edition | Stated in the app |
| **Behaviour inside the real claude.ai viewer, Safari and the Claude iOS app** | **Unverified** |

## Cloudflare edition (live sync)

| Feature | State |
|---|---|
| Worker + D1 sync API, same rules as the self-hosted server (revisions, conflicts never overwrite) | Tested against the real Worker under `wrangler dev` (11/11 checks) |
| Live updates between two devices (4-second check while open) | Simulated: a new task arrived on the other device in about 6 s |
| Password sign-in, one-time setup code, lockout after failed attempts | Simulated |
| D1 database `my-day` created in the Cloudflare account | Done |
| Deployed at https://my-day.liyakathalicm.workers.dev (auto-deploys on push to main) | Live; password set |
| Push notifications with the app closed | Not built yet for this edition |

## Look and feel

| Feature | State |
|---|---|
| Time-of-day background (dawn, day, evening, night) with slowly drifting colour, light and dark | Visually checked in Chromium at phone size |
| Gentle motion: cards float in, check pop and sparkle when a task is done, block progress bar | Visually checked in Chromium |
| All motion off when the phone's "Reduce motion" is on | CSS rule in place; not checked on a real iPhone |

## Daily quote (Today screen)

| Feature | State |
|---|---|
| Feel-good quote at the top of Today, same all day, new each day | Simulated (Pages edition) |
| Fetched from ZenQuotes every morning at 6:00 AM IST by the publish workflow into `quote.json` | Workflow written; first live fetch to be confirmed in the Actions log |
| Offline / fetch failed / claude.ai and self-hosted editions: rotating built-in quote (30 quotes) | Tested + Simulated |

## Milestone 1 — Plan ✔
Screen flow, stack, hosting and costs: docs/PLAN.md.

## Milestone 2 — Today, Tasks, Week, editable schedule

| Feature | State |
|---|---|
| Current and next time block in Asia/Kolkata (correct even if the phone is set to another zone) | Tested + Simulated |
| Sleep window across midnight; Saturday without live; Sunday weekly review; admin themes per weekday | Tested |
| Today’s three priorities with Done / Reschedule / Waiting | Simulated |
| Upcoming confirmed deadlines (tasks and money due dates), passed deadlines shown calmly, not red | Simulated |
| Quick Capture (one field, no onboarding) | Simulated |
| Lists: Today, This Week, Waiting, Later, Completed; category filter | Simulated |
| All task fields; planned date separate from real deadline | Tested + Simulated |
| Waiting: who, last contact, follow-up; returns only on follow-up date, never “overdue” | Tested + Simulated |
| Routines create separate daily tasks; completing one doesn’t affect others; no backlog of missed days | Tested + Simulated |
| Rescheduling one routine day leaves the series and other days alone | Tested + Simulated |
| Editing a routine updates only future, untouched days | Tested |
| Week view with themes, tasks, deadlines, schedule | Simulated |
| Schedule editor: edit/add/delete blocks, “change all days” vs “only this day”, single moments, overlap notice, reset | Simulated |
| Large touch targets (≥44 px) and no horizontal overflow on every screen | Simulated |
| Dark mode | Visually checked in Chromium only |

## Milestone 3 — Sign-in, persistence, sync, export/restore

| Feature | State |
|---|---|
| Single-user password sign-in (scrypt, HttpOnly Secure SameSite cookie, lockout) | Simulated (wrong password), server code reviewed |
| Tasks survive reload and sign-in; second device receives data | Simulated |
| Offline changes queued, clearly shown, synced on reconnect | Simulated |
| Conflicts never overwrite newer data; you choose which to keep | Tested (server) + Simulated |
| Export file / Restore (merge or replace) / invalid file rejected | Simulated |
| Server daily backups (14 kept) | Runs at start-up (seen in logs); rotation not exercised over days |
| Offline app shell via service worker | Simulated in Chromium |
| iPhone Safari vs Home Screen storage separation explained in-app | Built |

## Milestone 4 — Push reminders

| Feature | State |
|---|---|
| Server scheduler every 30 s, independent of the app | Tested |
| Each reminder sent once (also across restarts); stale reminders after downtime skipped | Tested |
| Completing a task cancels its reminder; rescheduling moves it | Tested |
| Quiet hours (default 10:30 PM–7:00 AM) hold reminders until 7:00 AM | Tested |
| Generic notification text, no task titles | Tested |
| Defaults: 9:00 AM office check, 9:30 PM shutdown, Sunday 6:00 PM weekly review | Tested |
| Install guidance, Enable button, test now, test in 2 minutes, clear status, denied/offline/not-installed states | Simulated |
| **Delivery to a real iPhone with the app closed** | **Unverified — needs your device (IPHONE-TESTING.md B12–B23)** |
| Delivery through Apple’s push service at all (VAPID subject accepted) | **Unverified** — this environment cannot reach Apple’s push servers |

## Milestone 5 — Office, Content, Money

| Feature | State |
|---|---|
| Office check: morning/closing, three 10-minute parts, editable checklist, foreground timer, decisions → tasks, history | Simulated (decision → task) |
| Content: 8 stages, formats (standalone recording / live / edited from live, linked), references with timestamps, editor instructions copied (never sent) | Simulated (create, advance stage) |
| Money: Personal/Business, received/spent, receivables/payables, expected income kept separate, due dates and status, settle → records actual money | Simulated (receivable → received) |

## Milestone 6 — Seven-day trial
**Not started** — needs you. Checklist in IPHONE-TESTING.md section C.

## Known limitations / unverified in this build
* Not tested in Safari/WebKit at all — only Chromium was available. iOS-specific behaviour (keyboard, safe areas, Home Screen mode, `navigator.share` for backup files) needs the real-device checks.
* The on-screen-keyboard handling was simulated by setting the same CSS values the app sets from `visualViewport`; real iOS keyboard behaviour is unverified.
* Deployment (Docker + Caddy) files were written but not run here (no Docker in this environment). The Node server itself was started and tested.
* Office timer runs only while the app is open (stated in the app).
* A whole-schedule edit on two devices at once produces one conflict for the schedule as a whole (not per block).
* No one-day overrides of the schedule (e.g. “this Tuesday only”) other than splitting a block per weekday.
