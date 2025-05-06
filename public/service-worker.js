
// Enhanced service worker for better offline capability
const CACHE_NAME = 'kisan-khata-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx',
  '/manifest.json',
  '/favicon.ico'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return a fallback if offline
            if (event.request.url.indexOf('/assets/') !== -1) {
              return caches.match('/assets/offline-image.jpg');
            }
            return caches.match('/offline.html');
          });
      })
  );
});

// Update service worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle local storage sync when coming back online
self.addEventListener('sync', event => {
  if (event.tag === 'sync-local-storage') {
    event.waitUntil(syncLocalStorage());
  }
});

async function syncLocalStorage() {
  // This would be implemented to sync any changes made while offline
  console.log('Syncing local storage data');
  return Promise.resolve();
}
