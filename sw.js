const CACHE_NAME = 'vocab-master-v23';
const ASSETS = [
  'index.html',
  'manifest.json',
  'logo.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('dictionaryapi')) {
    return fetch(e.request);
  }

  // Network-First Strategy to ensure updates are served immediately when online
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
