// Service worker: offline app shell + Web Push display.
// BUILD and ASSETS are filled in by the server when it serves this file, so a
// new deploy automatically produces a new cache.
const BUILD = '__BUILD__';
const ASSETS = __ASSETS__;
const CACHE = `myday-${BUILD}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  if (event.request.mode === 'navigate') {
    // './' where the build lists it (Pages, Cloudflare: their hosts redirect /index.html), else index.html.
    const shell = new URL(ASSETS.includes('./') ? './' : 'index.html', self.registration.scope).href;
    event.respondWith(caches.match(shell).then((r) => r || fetch(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then((r) => r || fetch(event.request)));
});

// Every push must show a notification (iOS revokes permission otherwise).
self.addEventListener('push', (event) => {
  let p = {};
  try { p = event.data ? event.data.json() : {}; } catch { /* ignore */ }
  event.waitUntil(self.registration.showNotification(p.title || 'My Day', {
    body: p.body || 'You have a reminder in My Day.',
    tag: p.tag || 'myday',
    icon: new URL('icons/icon-192.png', self.registration.scope).href,
    badge: new URL('icons/icon-192.png', self.registration.scope).href,
    data: { url: p.url || '/#today' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || '/#today';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) { await c.focus(); if ('navigate' in c) c.navigate(target).catch(() => {}); return; }
    }
    await self.clients.openWindow(target);
  })());
});
