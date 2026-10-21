# iPhone set-up, real-device checks and the 7-day trial

Everything below must be done **on your actual iPhone 16 Pro Max** after the app is
deployed with HTTPS. None of it can be confirmed from a simulator or desktop browser.
Tick each item and note anything odd.

## A. Install (iOS 16.4 or later)

1. Open your My Day address in **Safari**.
2. Share → **Add to Home Screen** → Add.
3. Open My Day from the Home Screen icon (no Safari address bar should be visible).
4. More → Sign-in and sync → sign in. (The Home Screen app has its own storage, separate from Safari.)

## B. Real-device checks

| # | Check | How | Result |
|---|---|---|---|
| 1 | Safe areas | Top text is not under the Dynamic Island; bottom nav sits above the home indicator, in portrait | ☐ |
| 2 | No sideways scrolling | Swipe left/right on every tab and More page | ☐ |
| 3 | Keyboard | Capture → type: the Save button stays visible above the keyboard; bottom nav hides while typing; no zoom when tapping a field | ☐ |
| 4 | Keyboard in long forms | New task → tap Notes (near the bottom): field scrolls into view, Save still reachable | ☐ |
| 5 | Time zone | Now card shows the correct IST block | ☐ |
| 6 | Persistence | Add a task, swipe the app away, reopen: task is there | ☐ |
| 7 | Offline | Airplane mode → open app (it loads), add a task, pill shows “Offline · 1 not synced” → airplane mode off → pill returns to “Saved” | ☐ |
| 8 | Second device | Sign in on a computer: the task appears there | ☐ |
| 9 | Conflict | Edit the same task on the computer and (offline) on the phone, then reconnect: the app asks which version to keep | ☐ |
| 10 | Export | More → Backup and restore → Save a backup file → Save to Files | ☐ |
| 11 | Restore | Choose that file → shows counts → Add missing and newer items | ☐ |
| 12 | Enable notifications | More → Reminders and notifications → **Enable Notifications** → Allow | ☐ |
| 13 | Test now | “Send test now” arrives within a few seconds | ☐ |
| 14 | **App closed** | “Test in 2 minutes (with app closed)” → swipe the app away → lock the phone → notification arrives | ☐ |
| 15 | Lock-screen privacy | Notification text is generic (“You have a reminder in My Day.”) — no task names | ☐ |
| 16 | Tap opens app | Tapping the notification opens My Day | ☐ |
| 17 | Task reminder | Task → Edit → Reminder “On the planned date” for 5 minutes from now → close app → arrives once | ☐ |
| 18 | Cancel on done | Same as 17, but mark the task Done before the time → nothing arrives | ☐ |
| 19 | Move on reschedule | Same as 17, but reschedule to tomorrow → nothing today; it comes tomorrow | ☐ |
| 20 | Quiet hours | A reminder set for 11:00 PM arrives at 7:00 AM instead | ☐ |
| 21 | Default reminders | 9:00 AM office check, 9:30 PM shutdown, Sunday 6:00 PM weekly review arrive | ☐ |
| 22 | Permission denied | iPhone Settings → Notifications → My Day → off; the app explains how to turn it back on | ☐ |
| 23 | Focus / Low Power | Note whether notifications are delayed or hidden — expected; this is not an alarm | ☐ |

If test 14 fails: check the server log for `push failed for one device: HTTP …`.
`403 BadJwtToken` almost always means `VAPID_SUBJECT` is missing or not a real `mailto:`/`https:` contact.
`410` means the subscription expired — turn notifications off and on again.

## C. Seven-day personal trial (Milestone 6)

Use the app as your only planner for seven days. Each evening, two minutes:

| Day | Note one thing that felt slow, confusing or stressful | One thing that helped |
|---|---|---|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |
| 4 |  |  |
| 5 |  |  |
| 6 |  |  |
| 7 (Sunday review) |  |  |

Things worth watching:
* Did the Now/Next card match what you were actually doing? Which blocks need moving?
* Were three priorities the right number? Did you use Capture, or skip it?
* Did any reminder arrive late, twice, or not at all? (Note the time.)
* Did anything feel like nagging? Anything look alarming when it didn’t need to?
* Office check: were the three 10-minute parts realistic?
* Money/Content: anything you had to work around?

Share the notes and I will refine the schedule defaults, wording and screens.
