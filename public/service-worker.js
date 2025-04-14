
// Service Worker for offline and portable functionality
const CACHE_NAME = 'kisan-khata-sahayak-v4';

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
          return name !== CACHE_NAME && name !== 'portable-data-cache';
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

// Handle portable mode detection and data management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PORTABLE_MODE') {
    console.log('Running in portable mode');
    // Special handling for portable mode if needed
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle auto-saving in portable mode
  if (event.data && event.data.type === 'SAVE_DATA') {
    try {
      console.log('Service worker received data to save');
      const dataToSave = event.data.data;
      
      // Store in cache for retrieval when app reopens
      caches.open('portable-data-cache').then(cache => {
        const blob = new Blob([JSON.stringify(dataToSave)], { type: 'application/json' });
        const response = new Response(blob);
        cache.put('data.json', response);
        console.log('Service worker cached updated data');
      });
    } catch (error) {
      console.error('Service worker failed to save data:', error);
    }
  }
});

// Handle file:// protocol for portable mode
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

// Handle auto-recovery from cached data
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('data.json')) {
    event.respondWith(
      caches.match('data.json', { cacheName: 'portable-data-cache' })
        .then(response => {
          if (response) {
            console.log('Recovered data from service worker cache');
            return response;
          }
          return fetch(event.request);
        })
        .catch(() => fetch(event.request))
    );
  }
});
