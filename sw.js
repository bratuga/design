// Retire only the old Design testbench cache. No offline caching in Orbit.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) {
    if (key.startsWith('modernux-test-')) await caches.delete(key);
  }
  await self.clients.claim();
  await self.registration.unregister();
})()));
