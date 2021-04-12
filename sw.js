var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/browneebackground.webp',
    '/styles/main.css',
    '/script/main.js',
    'https://fonts.googleapis.com/css2?family=Vollkorn:wght@500&display=swap'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});