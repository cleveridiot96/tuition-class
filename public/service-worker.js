// Service Worker for offline functionality
const CACHE_NAME = 'kisan-khata-sahayak-v3';
const DYNAMIC_CACHE = 'kisan-khata-dynamic-v2';

// List of core assets to cache for offline use
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

// Optimize image files if they are being fetched
const compressImage = async (response) => {
  // Only compress images if we have the capability
  if (self.createImageBitmap && response.headers.get('content-type')?.includes('image')) {
    try {
      const blob = await response.clone().blob();
      const bitmap = await createImageBitmap(blob, {
        resizeWidth: 800, // Limit size to 800px
        resizeQuality: 'medium'
      });
      
      // Create a canvas to draw the resized image
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      
      // Convert back to blob with compression
      const compressedBlob = await canvas.convertToBlob({
        type: 'image/webp', // Convert to WebP for better compression
        quality: 0.8
      });
      
      // Return the compressed image as a new Response
      return new Response(compressedBlob, {
        headers: response.headers
      });
    } catch (e) {
      console.warn('Image compression failed, using original:', e);
      return response;
    }
  }
  return response;
};

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
          return name !== CACHE_NAME && name !== DYNAMIC_CACHE;
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

// Helper function to determine if a request should be cached
const shouldCache = (url) => {
  // Skip API requests, analytics, etc.
  if (url.includes('/api/') || url.includes('analytics') || url.includes('tracking')) {
    return false;
  }
  
  // Cache assets
  return url.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?)$/) || urlsToCache.includes(url);
};

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and requests to external domains
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Get the URL from the request
  const requestUrl = new URL(event.request.url);
  
  // Skip tracking and unnecessary assets
  if (requestUrl.pathname.includes('analytics') || 
      requestUrl.pathname.includes('tracking')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(async (response) => {
        // Return from cache if found
        if (response) {
          return response;
        }

        // Clone the request - request can only be used once
        const fetchRequest = event.request.clone();

        // Otherwise, fetch from network
        return fetch(fetchRequest).then(async (response) => {
          // Don't cache if response is not valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Try to optimize images if possible
          const optimizedResponse = await compressImage(response);
          
          // Only cache assets that we care about
          if (shouldCache(event.request.url)) {
            // Clone the optimized response as it can only be consumed once
            const responseToCache = optimizedResponse.clone();
            
            // Cache the fetched resource
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }

          return optimizedResponse;
        }).catch((error) => {
          console.error('Fetch failed; returning offline page instead.', error);
          // If fetch fails (e.g., user is offline), return a fallback
          return caches.match('/index.html');
        });
      })
  );
});

// Clean up stale dynamic cache entries periodically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAN_DYNAMIC_CACHE') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        // Get all cache entries
        return cache.keys().then((keys) => {
          // Get current time
          const now = Date.now();
          
          // Delete entries older than 7 days
          const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
          
          return Promise.all(
            keys.map((key) => {
              return cache.match(key).then((response) => {
                if (response) {
                  const dateHeader = response.headers.get('date');
                  if (dateHeader) {
                    const cacheTime = new Date(dateHeader).getTime();
                    if (now - cacheTime > maxAge) {
                      return cache.delete(key);
                    }
                  }
                }
                return Promise.resolve();
              });
            })
          );
        });
      })
    );
  }
});

// Periodic background sync for important updates when back online
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // This would sync any local data when the user comes back online
  console.log('Background sync triggered');
  // For truly offline app, this would just save data locally
  
  // Notify the app that sync has occurred
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      timestamp: Date.now()
    });
  }
}

// Listen for storage events (like USB drive disconnection)
self.addEventListener('storage', (event) => {
  console.log('Storage event in service worker:', event);
});
