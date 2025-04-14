// Service Worker for offline and portable functionality with data compression
const CACHE_NAME = 'kisan-khata-sahayak-v5';

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

// Handle compression for portable data
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PORTABLE_MODE') {
    console.log('Running in portable mode with data compression enabled');
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle auto-saving in portable mode with compression
  if (event.data && event.data.type === 'SAVE_DATA') {
    try {
      console.log('Service worker received data to save - compressing...');
      const dataToSave = event.data.data;
      
      // Import compression library dynamically
      importScripts('/assets/lz-string.min.js');
      
      // Store in cache for retrieval when app reopens
      caches.open('portable-data-cache').then(cache => {
        // Compress data if available
        let dataToStore;
        
        if (typeof LZString !== 'undefined' && JSON.stringify(dataToSave).length > 1024) {
          dataToStore = LZString.compress(JSON.stringify(dataToSave));
          console.log('Data compressed for storage');
        } else {
          dataToStore = JSON.stringify(dataToSave);
        }
        
        const blob = new Blob([dataToStore], { 
          type: 'application/octet-stream' 
        });
        const response = new Response(blob, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'X-Compressed': typeof LZString !== 'undefined' ? 'true' : 'false'
          }
        });
        cache.put('data.json', response);
        console.log('Service worker cached compressed data');
      });
    } catch (error) {
      console.error('Service worker failed to save data:', error);
    }
  }
});

// Handle auto-recovery from cached data with decompression
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('data.json')) {
    event.respondWith(
      caches.match('data.json', { cacheName: 'portable-data-cache' })
        .then(response => {
          if (response) {
            console.log('Recovered data from service worker cache');
            
            return response.clone().text().then(text => {
              // Check if data is compressed
              const isCompressed = response.headers.get('X-Compressed') === 'true';
              
              if (isCompressed && typeof LZString !== 'undefined') {
                try {
                  const decompressed = LZString.decompress(text);
                  return new Response(decompressed, {
                    headers: { 'Content-Type': 'application/json' }
                  });
                } catch (e) {
                  console.error('Error decompressing data:', e);
                  return response;
                }
              } else {
                return response;
              }
            });
          }
          return fetch(event.request);
        })
        .catch(() => fetch(event.request))
    );
  }
});

// Background sync for data operations when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('Attempting to sync data in background');
    // We'll implement this when needed
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
