// Fetches today's quote from ZenQuotes and writes it next to the GitHub Pages
// build (dist-pages/quote.json). Run every morning by the publish workflow.
// If the fetch fails nothing is written and the app shows a built-in quote.
import fs from 'node:fs';
import { todayStr } from '../public/js/core/time.js';

const out = new URL('../dist-pages/quote.json', import.meta.url);
try {
  const res = await fetch('https://zenquotes.io/api/today', { signal: AbortSignal.timeout(15000) });
  const [x] = await res.json();
  if (!res.ok || !x?.q || !x?.a || /too many requests/i.test(x.q)) throw new Error('unexpected response');
  const quote = { date: todayStr('Asia/Kolkata'), q: x.q.trim(), a: x.a.trim(), source: 'zenquotes' };
  fs.writeFileSync(out, JSON.stringify(quote));
  console.log('quote.json written:', quote.q, '—', quote.a);
} catch (e) {
  console.log('Could not fetch today’s quote (' + e.message + '); the app will use a built-in quote.');
}
