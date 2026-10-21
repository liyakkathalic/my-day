// Today's quote: fetched once a day from quote.json (refreshed every morning by
// the GitHub Pages workflow), remembered on the device, and replaced by a
// built-in quote when it can't be reached.
import { IS_LOCAL } from './config.js';
import { builtInQuote } from './core/quotes.js';

const KEY = 'myday-quote';
const URL_ = IS_LOCAL ? 'quote.json' : 'https://liyakkathalic.github.io/my-day/quote.json';
const valid = (x) => x && typeof x.q === 'string' && x.q.trim() && x.q.length < 400 && typeof x.a === 'string';

export function cachedQuote(today) {
  try {
    const c = JSON.parse(localStorage.getItem(KEY));
    if (c?.day === today && valid(c)) return c;
  } catch { /* ignore */ }
  return null;
}

export async function loadQuote(today) {
  const cached = cachedQuote(today);
  if (cached) return cached;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 5000);
    const res = await fetch(URL_, { cache: 'no-store', signal: ctl.signal });
    clearTimeout(t);
    const x = await res.json();
    if (!res.ok || !valid(x)) throw new Error('bad quote');
    const quote = { q: x.q.trim(), a: x.a.trim() || 'Unknown', source: x.source || 'web', day: today };
    // Only remember it for the day if it is today's file; otherwise try again later.
    if (x.date === today) { try { localStorage.setItem(KEY, JSON.stringify(quote)); } catch { /* ignore */ } }
    return quote;
  } catch {
    return { ...builtInQuote(today), day: today };
  }
}
