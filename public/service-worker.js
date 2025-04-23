
// Service Worker for offline functionality
const CACHE_NAME = 'kisan-khata-sahayak-v4';
const DYNAMIC_CACHE = 'kisan-khata-dynamic-v3';

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

// Optimize cache management with improved strategies
const CACHE_STRATEGIES = {
  // Network first, falling back to cache
  NETWORK_FIRST: 'network-first',
  // Cache first, falling back to network
  CACHE_FIRST: 'cache-first',
  // Stale-while-revalidate: return cache then update
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Define which strategy to use for different types of requests
const getStrategyForRequest = (url) => {
  const urlObj = new URL(url);
  
  // For API endpoints, always try network first
  if (url.includes('/api/')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // For core app assets, prefer cache
  if (urlsToCache.includes(urlObj.pathname) || 
      url.match(/\.(js|css|woff2?)$/)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // For images, use stale-while-revalidate for a good balance
  if (url.match(/\.(png|jpe?g|gif|svg|webp)$/)) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // Default to network first for everything else
  return CACHE_STRATEGIES.NETWORK_FIRST;
};

// Optimize image files if they are being fetched
const compressImage = async (response) => {
  // Only compress images if we have the capability
  if (self.createImageBitmap && response.headers.get('content-type')?.includes('image')) {
    try {
      const blob = await response.clone().blob();
      // Skip compression for small images (under 50KB)
      if (blob.size < 50 * 1024) {
        return response;
      }
      
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
        quality: 0.75
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
    }).then(() => {
      // Take control of all clients as soon as it activates
      return self.clients.claim();
    })
  );
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

// Handle different caching strategies
const handleNetworkFirst = async (request) => {
  try {
    // Try network first
    const networkResponse = await fetch(request.clone());
    
    // Cache response if valid and caching is appropriate
    if (networkResponse && networkResponse.status === 200 && shouldCache(request.url)) {
      const responseToCache = await compressImage(networkResponse.clone());
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // Fall back to cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    
    // If no cache found, return offline fallback
    return caches.match('/index.html');
  }
};

const handleCacheFirst = async (request) => {
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  
  // Fall back to network
  try {
    const networkResponse = await fetch(request.clone());
    
    // Cache the response for future use
    if (networkResponse && networkResponse.status === 200 && shouldCache(request.url)) {
      const responseToCache = await compressImage(networkResponse.clone());
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // If both cache and network fail
    return caches.match('/index.html');
  }
};

const handleStaleWhileRevalidate = async (request) => {
  // Check cache first
  const cachedResponse = await caches.match(request);
  
  // Start fetch request immediately (don't await)
  const fetchPromise = fetch(request.clone())
    .then(async (networkResponse) => {
      if (networkResponse && networkResponse.status === 200 && shouldCache(request.url)) {
        const responseToCache = await compressImage(networkResponse.clone());
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, responseToCache);
      }
      return networkResponse;
    })
    .catch(() => {
      // If fetch fails, we already returned cached version if available
      console.log('Network request failed, already served from cache');
    });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If nothing in cache, wait for network
  return fetchPromise;
};

// Fetch event - handle with different strategies
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

  // Determine strategy based on request type
  const strategy = getStrategyForRequest(event.request.url);
  
  // Use appropriate strategy
  switch (strategy) {
    case CACHE_STRATEGIES.NETWORK_FIRST:
      event.respondWith(handleNetworkFirst(event.request));
      break;
    case CACHE_STRATEGIES.CACHE_FIRST:
      event.respondWith(handleCacheFirst(event.request));
      break;
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      event.respondWith(handleStaleWhileRevalidate(event.request));
      break;
    default:
      event.respondWith(handleNetworkFirst(event.request));
  }
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

// Handle data sync
async function syncData() {
  console.log('Background sync triggered');
  
  // Notify the app that sync has occurred
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      timestamp: Date.now()
    });
  }
  
  return true;
}
