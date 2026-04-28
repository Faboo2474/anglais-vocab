const CACHE_NAME = 'vocab-master-v5';
const ASSETS = [
  '/',
  'index.html',
  'manifest.json'
];

// Installation : Mise en cache des fichiers essentiels
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Récupération : Stratégie Cache-First
self.addEventListener('fetch', (e) => {
  // On ne met pas en cache les appels API (Dictionnaire)
  if (e.request.url.includes('dictionaryapi')) {
    return fetch(e.request);
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
