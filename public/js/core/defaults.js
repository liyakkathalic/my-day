// Default data. Everything here is editable in the app; these are only the
// starting values used on first launch (and by "Reset to default schedule").

export const CATEGORIES = ['Family', 'Sitz Ergo', 'Content', 'Personal', 'Finance', 'Complaints', 'Migration'];

const ALL = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];
const SAT = [6];
const SUN = [0];
const MON_SAT = [1, 2, 3, 4, 5, 6];

let n = 0;
const b = (days, start, end, title, kind, extra = {}) => ({ id: `b${String(++n).padStart(2, '0')}`, days, start, end, title, kind, ...extra });

// kind: routine | office | work | break | family | admin | live | buffer | marker | sleep | review
export function defaultBlocks() {
  n = 0;
  return [
    // Daily
    b(ALL, '07:00', '09:00', 'Personal routine, breakfast and family', 'routine'),
    b(MON_SAT, '09:00', '09:30', 'Office morning check', 'office', { link: 'office' }),
    b(SUN, '09:00', '09:30', 'Brief office update (only if needed)', 'office', { link: 'office' }),
    b(ALL, '21:30', null, 'Work shutdown', 'marker'),
    b(ALL, '23:00', '07:00', 'Protected sleep window', 'sleep'),
    // Monday–Friday
    b(WEEKDAYS, '09:30', '11:30', 'Topic research and references', 'work'),
    b(WEEKDAYS, '11:30', '12:00', 'Break and calls', 'break'),
    b(WEEKDAYS, '12:00', '13:00', 'Reaction clip preparation', 'work'),
    b(WEEKDAYS, '13:00', '14:00', 'Lunch and rest', 'break'),
    b(WEEKDAYS, '14:00', '15:00', 'Clips, thumbnail and live outline', 'work'),
    b(WEEKDAYS, '15:00', '15:30', 'Editor coordination and output review', 'work'),
    b(WEEKDAYS, '15:30', '16:15', 'Daily administration', 'admin', { link: 'admin' }),
    b(WEEKDAYS, '16:15', '16:35', 'Office closing check', 'office', { link: 'office' }),
    b(WEEKDAYS, '16:35', '17:30', 'Buffer', 'buffer'),
    b(WEEKDAYS, '17:30', '19:15', 'Family, personal needs and dinner', 'family'),
    b(WEEKDAYS, '19:15', '20:00', 'Live preparation', 'live'),
    b(WEEKDAYS, '20:00', '21:15', 'Live session', 'live'),
    b(WEEKDAYS, '21:15', '21:30', 'Editor handoff and tomorrow’s priorities', 'work'),
    // Saturday — no default live session
    b(SAT, '09:30', '13:00', 'Flexible content preparation', 'work'),
    b(SAT, '13:00', '14:00', 'Lunch and rest', 'break'),
    b(SAT, '14:00', '17:30', 'Household errands', 'family'),
    b(SAT, '17:30', '21:30', 'Family and personal time', 'family'),
    // Sunday
    b(SUN, '09:30', '18:00', 'Family and rest', 'family'),
    b(SUN, '18:00', '18:20', 'Weekly review', 'review'),
    b(SUN, '18:20', '21:30', 'Family and rest', 'family'),
  ];
}

export function defaultThemes() {
  return {
    1: 'Business jobs, clients and collections',
    2: 'Bank, credit and legal follow-ups',
    3: 'Household expenses and family needs',
    4: 'Support cases and migration planning',
    5: 'Weekly finances and next week’s content',
  };
}

export const defaultSchedule = () => ({ blocks: defaultBlocks(), themes: defaultThemes() });

export function defaultOfficeTemplate() {
  return {
    sections: [
      { id: 'brother', title: 'Brother', minutes: 10, items: ['Jobs', 'Staff', 'Materials', 'Blockers'] },
      { id: 'admin', title: 'Admin', minutes: 10, items: ['Customers', 'Quotations', 'Billing', 'Collections'] },
      { id: 'mine', title: 'My decisions', minutes: 10, items: ['Decision', 'Owner', 'Next action'], decisions: true },
    ],
  };
}

export const defaultSettings = () => ({ tz: 'Asia/Kolkata', quietStart: '22:30', quietEnd: '07:00' });

// Notification text is deliberately generic so nothing private shows on the lock screen.
export const GENERIC_TEXT = {
  office: 'Time for your office check.',
  shutdown: 'Time to start your work shutdown.',
  review: 'Time for your weekly review.',
  task: 'You have a reminder in My Day.',
  custom: 'You have a reminder in My Day.',
  test: 'Test notification from My Day. Notifications are working.',
};

export function defaultReminders() {
  return [
    { id: 'default-office', label: 'Office check', textKey: 'office', enabled: true, schedule: { type: 'daily', time: '09:00' } },
    { id: 'default-shutdown', label: 'Work shutdown', textKey: 'shutdown', enabled: true, schedule: { type: 'daily', time: '21:30' } },
    { id: 'default-review', label: 'Weekly review', textKey: 'review', enabled: true, schedule: { type: 'weekly', weekday: 0, time: '18:00' } },
  ];
}

export const CONTENT_STAGES = ['Idea', 'Research', 'Clips', 'Thumbnail', 'Ready', 'Live/Recorded', 'Editor', 'Published'];
export const CONTENT_FORMATS = {
  recording: 'Standalone recording',
  live: 'Live session',
  liveEdit: 'Edited from a live session',
};

export const MONEY_TYPES = {
  received: 'Money received',
  spent: 'Money spent',
  expected: 'Expected income',
  receivable: 'Someone owes me',
  payable: 'I need to pay',
};
