# My Day — Milestone 1: plan, stack, hosting and costs

## Screen flow

```
                    ┌───────────── Bottom navigation (always visible) ─────────────┐
                    │      Today        Tasks          Week           More          │
                    └──────────────────────────────────────────────────────────────┘
Today
 ├─ Now / Next block card ── (office block) → Office checklist
 ├─ Today’s three priorities ── each: Done · Reschedule · Waiting
 │     └─ "+ Choose a priority" → picker (existing task or type a new one)
 ├─ Follow up today (only waiting items whose follow-up date has arrived)
 ├─ Upcoming deadlines (confirmed deadlines, next 14 days; money due dates too)
 ├─ Also today (other planned tasks) → tap a task → action sheet
 │     Done · Reschedule · Waiting · Make a priority · Later · Edit
 └─ [＋ Capture] floating button → one-field Quick Capture sheet

Tasks
 ├─ Lists: Today · This Week · Waiting · Later · Completed
 ├─ Category filter: Family · Sitz Ergo · Content · Personal · Finance · Complaints · Migration
 ├─ + New task → full editor (title, next action, category, owner, planned date,
 │                real deadline, status, follow-up, notes, reminder)
 └─ Routines → recurring series

Week
 ├─ Previous / Next week
 └─ Day cards: admin theme, planned tasks, deadlines, follow-ups, schedule blocks,
    "+ Plan something for this day", "Edit this day’s schedule"

More
 ├─ Plan:   Office check · Content · Money · Routines
 ├─ Set up: Schedule · Administration themes · Reminders and notifications ·
 │          Add to Home Screen · Settings (time zone, quiet hours)
 └─ Data:   Sign-in and sync (status, conflicts) · Backup and restore
```

First launch shows Today immediately with the default schedule, themes, office
checklist and the three default reminders already in place. There is no
onboarding form. Sign-in is optional until you want cloud backup and push reminders.

## Technology stack (no paid services)

| Part | Choice | Why |
|---|---|---|
| App | Plain JavaScript modules + Preact/htm (vendored, 13 KB), no build step | Small, fast on iPhone, nothing to compile, easy to maintain |
| Offline | Service worker (app shell cache) + IndexedDB (all data) | Works with no signal; changes queue until online |
| Server | Node.js 22, built-in `node:sqlite`, one dependency (`web-push`) | One process, one file database, easy backups |
| Sync | Per-record revisions + outbox; conflicts never overwrite silently | Safe offline editing across iPhone and desktop |
| Sign-in | Single password (scrypt hash), HttpOnly/Secure/SameSite=Strict cookie, lockout after failed attempts | Secure and simple for one user |
| Push | Standard Web Push with VAPID keys; server scheduler every 30 s with a send-once log | Works with the app closed (iOS 16.4+, Home Screen app) |
| HTTPS | Caddy (automatic free Let’s Encrypt certificates) | Required by iOS for push and service workers |
| Shared logic | Time zone, schedule, recurrence and reminder rules are one set of modules used by both app and server | Reminders and screens can never disagree |

## Hosting requirements

* An always-on Linux machine (the scheduler must run while your phone is closed).
  1 vCPU / 512 MB RAM / 1 GB disk is plenty.
* A public HTTPS address (domain or free subdomain) pointing to it.
* Docker (recommended) or Node.js 22.13+.
* Outbound HTTPS to Apple’s push service (`*.push.apple.com`) and others.

Not suitable: "free" hosts that sleep when idle (reminders would be missed),
static-only hosts (no scheduler).

## Recurring costs (approximate — check current prices before choosing)

| Option | Monthly | Notes |
|---|---|---|
| **A. Oracle Cloud "Always Free" VM + free DuckDNS subdomain** | ₹0 | Needs a card for identity verification; free capacity is sometimes unavailable in some regions |
| B. Small paid VPS (e.g. Hetzner, DigitalOcean, Lightsail entry plans) | roughly ₹350–550 | Most predictable; **needs your approval** |
| C. A computer at home that stays on + Cloudflare Tunnel | ₹0 + electricity | Needs a domain on Cloudflare (≈ ₹800–1,200 per year) |
| Own domain (optional for A/B) | ≈ ₹70–100 averaged | Nicer address; not required |
| Web Push (Apple/Google/Mozilla) | ₹0 | Free |

Recommendation: start with **A** (₹0). Move to **B** only if the free VM is unreliable
for you; that is the only paid item and I have not signed up for anything.

## Milestones

1. Plan (this document) ✔
2. Today, Tasks, Week, editable schedule ✔
3. Sign-in, persistence, sync, export/restore ✔
4. Real iPhone push reminders — server and app done; **real-device delivery must be verified by you** (see IPHONE-TESTING.md)
5. Office, Content, simple Money ✔
6. Seven-day personal trial — checklist in IPHONE-TESTING.md

Out of scope for v1 (by design): AI chat, email access, bank connections, staff
accounts or staff messaging, video hosting.
