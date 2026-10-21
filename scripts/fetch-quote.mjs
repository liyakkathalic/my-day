// Fetches today's quote from ZenQuotes and writes it next to the GitHub Pages
// build (dist-pages/quote.json). Run every morning by the publish workflow.
// If the fetch fails nothing is written and the app shows a built-in quote.
import fs from 'node:fs';
import { todayStr } from '../public/js/core/time.js';

// Skip quotes that are harsh rather than feel-good; the app then shows a gentle
// built-in quote for the day instead.
const HARSH = /\b(death|dead|die[sd]?|dying|kill\w*|grave|shorter|war|hate\w*|suffer\w*|pain(s|ful)?|enem\w+|weak\w*|stupid\w*|fools?|lazy|failure|cruel\w*|misery|despair|blood)\b/i;
const isGentle = (q) => !HARSH.test(q);

const out = new URL('../dist-pages/quote.json', import.meta.url);
try {
  const res = await fetch('https://zenquotes.io/api/today', { signal: AbortSignal.timeout(15000) });
  const [x] = await res.json();
  if (!res.ok || !x?.q || !x?.a || /too many requests/i.test(x.q)) throw new Error('unexpected response');
  if (!isGentle(x.q)) throw new Error('quote skipped as not feel-good: ' + x.q);
  const quote = { date: todayStr('Asia/Kolkata'), q: x.q.trim(), a: x.a.trim(), source: 'zenquotes' };
  fs.writeFileSync(out, JSON.stringify(quote));
  console.log('quote.json written:', quote.q, '—', quote.a);
} catch (e) {
  console.log('Could not fetch today’s quote (' + e.message + '); the app will use a built-in quote.');
}
