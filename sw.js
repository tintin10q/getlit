'use strict'

var CACHE_NAME = 'getlit-cache-v2';
var urlsToCache = [
    '/',
    '/browneebackground.webp',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css2?family=Vollkorn:wght@500&display=swap'
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

        return fetch(event.request).then( // then on a return that is pretty cool
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 /*|| response.type !== 'basic'*/) {
              return response;
            }

            // Clone because you can only consume a stream once
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Make sure you only have the v2 cache
self.addEventListener('activate', function(event) {
    console.log("Activated service worker")
  var cacheAllowlist = ['getlit-cache-v2'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) { 
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});