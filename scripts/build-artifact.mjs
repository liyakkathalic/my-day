// Builds the claude.ai web-app edition into dist-artifact/my-day.html:
// one page with the CSS and the bundled JavaScript inlined (that host only
// allows inline code), MYDAY_MODE set to "artifact" so data is kept in the
// claude.ai account's private store, and no service worker.
import { build } from 'esbuild';
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const out = new URL('dist-artifact/', root);
fs.mkdirSync(out, { recursive: true });

const js = (await build({
  entryPoints: [new URL('public/js/app.js', root).pathname],
  bundle: true, format: 'iife', minify: true, write: false, target: 'safari15',
  define: { MYDAY_MODE: '"artifact"' },
})).outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

let css = fs.readFileSync(new URL('public/css/app.css', root), 'utf8');
// The claude.ai frame already pads the page by the phone's top/bottom safe areas.
css += '\n/* web-app edition */\n.screen { padding-block: 14px calc(var(--nav-h) + var(--safe-b) + 96px); }\n.banner { padding-top: 10px; }\nbody { background: var(--bg); }\n';

const page = `<title>My Day</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
${css}</style>
<div id="app"><p class="boot">Loading My Day…</p></div>
<script>
${js}</script>
`;
fs.writeFileSync(new URL('my-day.html', out), page);
console.log(`dist-artifact/my-day.html written (${Math.round(page.length / 1024)} KB)`);
