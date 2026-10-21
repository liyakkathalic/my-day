// Renders the app icon SVG to the PNG sizes iOS and the manifest need.
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#2f6f62"/>
  <g transform="translate(256 256) scale(${1 - pad})">
    <circle r="92" fill="none" stroke="#f6f5f1" stroke-width="30"/>
    <g stroke="#f6f5f1" stroke-width="30" stroke-linecap="round">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="0" y1="-140" x2="0" y2="-176" transform="rotate(${a})"/>`).join('')}
    </g>
  </g>
</svg>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage();
const out = new URL('../public/icons/', import.meta.url);
fs.mkdirSync(out, { recursive: true });
for (const [name, size, pad] of [['icon-192.png', 192, 0], ['icon-512.png', 512, 0], ['apple-touch-icon.png', 180, 0], ['icon-maskable-512.png', 512, 0.22]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg(pad)}`);
  fs.writeFileSync(new URL(name, out), await page.screenshot({ omitBackground: false }));
}
await browser.close();
console.log('icons written');
