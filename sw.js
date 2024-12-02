'use strict'

const CACHE_NAME = 'getlit-cache-v4';
const urlsToCache = [
	'/',
	'/brownie.png',
	'/browneebackground.webp',
	'https://fonts.googleapis.com/css2?family=Vollkorn&display=swap&text=0123456789abcdefghijklmnopqrstuvwxyzABCEFHIMNOTSLW%E2%9C%A8%F0%9F%A4%AF%28%29%25%3A%3F%E2%86%91%2F.%20%2C',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Saved files in service worker cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {

            // Check if we received a valid response
            if (!response || response.status !== 200 || !event.request.url.startsWith('http')) {return response;}

            // Clone because you can only consume a stream once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME).then(cache => {cache.put(event.request, responseToCache);});

            return response;
          }
        );
      })
    );
});

// Make sure you only have the latest cache
self.addEventListener('activate', function(event) {
    console.log("Activated service worker")
    const cacheAllowlist = [CACHE_NAME];
    event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
