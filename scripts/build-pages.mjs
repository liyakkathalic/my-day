// Builds the GitHub Pages edition into dist-pages/: static files only, data
// kept on the device (MYDAY_MODE = "local"), installable and offline through the
// service worker. All paths are relative so it works under /<repo>/.
// `node scripts/build-pages.mjs cloud` builds the Cloudflare edition into
// dist-cloud/ instead: the same files with MYDAY_MODE = "cloud" (sync through
// the Worker's /api) and a _headers file with the security headers.
import { build } from 'esbuild';
import fs from 'node:fs';
import crypto from 'node:crypto';

const root = new URL('../', import.meta.url);
const CLOUD = process.argv[2] === 'cloud';
const outName = CLOUD ? 'dist-cloud' : 'dist-pages';
const out = new URL(`${outName}/`, root);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(new URL('css/', out), { recursive: true });
fs.mkdirSync(new URL('icons/', out), { recursive: true });

const js = (await build({
  entryPoints: [new URL('public/js/app.js', root).pathname],
  bundle: true, format: 'iife', minify: true, write: false, target: 'safari15',
  define: { MYDAY_MODE: CLOUD ? '"cloud"' : '"local"' },
})).outputFiles[0].text;
fs.writeFileSync(new URL('app.js', out), js);
fs.copyFileSync(new URL('public/css/app.css', root), new URL('css/app.css', out));
for (const f of fs.readdirSync(new URL('public/icons/', root))) fs.copyFileSync(new URL(`public/icons/${f}`, root), new URL(`icons/${f}`, out));

const html = fs.readFileSync(new URL('public/index.html', root), 'utf8')
  .replace('<script type="module" src="/js/app.js"></script>', '<script defer src="app.js"></script>')
  .replace(/(href|src)="\/(?!\/)/g, '$1="')
  .replace('<meta name="robots"', `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'self'" />\n  <meta name="robots"`);
fs.writeFileSync(new URL('index.html', out), html);

const manifest = JSON.parse(fs.readFileSync(new URL('public/manifest.webmanifest', root), 'utf8'));
Object.assign(manifest, { id: './', start_url: './#today', scope: './' });
manifest.icons = manifest.icons.map((i) => ({ ...i, src: i.src.replace(/^\//, '') }));
fs.writeFileSync(new URL('manifest.webmanifest', out), JSON.stringify(manifest, null, 2));

// Service worker with a build id and the list of files to keep offline.
const assets = ['./', ...(CLOUD ? [] : ['index.html']), 'app.js', 'css/app.css', 'manifest.webmanifest', ...fs.readdirSync(new URL('icons/', out)).map((f) => `icons/${f}`)];
const hash = crypto.createHash('sha256');
for (const a of new Set(['index.html', ...assets.slice(1)])) hash.update(fs.readFileSync(new URL(a, out)));
const sw = fs.readFileSync(new URL('public/sw.js', root), 'utf8')
  .replace('__BUILD__', hash.digest('hex').slice(0, 12))
  .replace('__ASSETS__', JSON.stringify(assets));
fs.writeFileSync(new URL('sw.js', out), sw);
if (CLOUD) {
  fs.writeFileSync(new URL('_headers', out), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Frame-Options: DENY
  X-Robots-Tag: noindex, nofollow
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000
/sw.js
  Cache-Control: no-cache
`);
} else {
  fs.writeFileSync(new URL('.nojekyll', out), '');
}
console.log(`${outName}/ written (${assets.length + 1} files)`);
