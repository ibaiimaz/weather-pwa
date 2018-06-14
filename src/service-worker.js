var cacheName = 'weatherPWA-step-6-2';
var filesToCache = [
  '/',
  'index.html',
  '**.js',
  '**.css',
  'assets/images/clear.png',
  'assets/images/cloudy-scattered-showers.png',
  'assets/images/cloudy.png',
  'assets/images/fog.png',
  'assets/images/ic_add_white_24px.svg',
  'assets/images/ic_refresh_white_24px.svg',
  'assets/images/partly-cloudy.png',
  'assets/images/rain.png',
  'assets/images/scattered-showers.png',
  'assets/images/sleet.png',
  'assets/images/snow.png',
  'assets/images/thunderstorm.png',
  'assets/images/wind.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
