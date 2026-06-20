const CACHE_NAME = 'montien-tech-terminal-win-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/assets/logo.png',
  '/manifest.json',
  '/lib/xterm.css',
  '/lib/xterm.js',
  '/lib/xterm-addon-fit.js',
  '/lib/lucide.min.js',
  '/fonts/inter/400.css',
  '/fonts/jetbrains-mono/400.css',
  '/fonts/prompt/400.css',
  '/fonts/prompt/thai.css',
  '/fonts/press-start-2p/400.css',
  '/fonts/silkscreen/400.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('Pre-caching some assets failed', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Simple Cache falling back to network strategy
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(e.request).then(response => {
        // Don't cache WebSocket or non-http requests
        if (!response || response.status !== 200 || !e.request.url.startsWith('http')) {
          return response;
        }
        
        // Cache dynamic assets on the fly
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, responseClone);
        });
        
        return response;
      }).catch(() => {
        // Offline fallback
      });
    })
  );
});
