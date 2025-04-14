// Service Worker for offline functionality
const CACHE_NAME = 'kisan-khata-sahayak-v3';

// List of assets to cache for offline use
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
  '/favicon.ico',
  '/placeholder.svg',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and adding resources');
        return cache.addAll(urlsToCache);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          console.log('Deleting old cache:', name);
          return caches.delete(name);
        })
      );
    })
  );
  
  // Take control of all clients as soon as it activates
  event.waitUntil(self.clients.claim());
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return from cache if found
        if (response) {
          return response;
        }

        // Clone the request - request can only be used once
        const fetchRequest = event.request.clone();

        // Otherwise, fetch from network
        return fetch(fetchRequest).then((response) => {
          // Don't cache if response is not valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response as it can only be consumed once
          const responseToCache = response.clone();
          
          // Cache the fetched resource
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.error('Fetch failed; returning offline page instead.', error);
          // If fetch fails (e.g., user is offline), return a fallback
          return caches.match('/index.html');
        });
      })
  );
});

// Handle portable mode detection
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PORTABLE_MODE') {
    console.log('Running in portable mode');
    // Special handling for portable mode if needed
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Ensure the app works well in a portable environment
self.addEventListener('fetch', (event) => {
  // For local file access (file:// protocol in portable mode)
  if (event.request.url.startsWith('file://')) {
    event.respondWith(
      fetch(event.request)
        .catch((error) => {
          console.error('Error fetching local file:', error);
          return caches.match('/index.html');
        })
    );
  }
});
