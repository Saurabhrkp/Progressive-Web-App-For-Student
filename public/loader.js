//This is the service worker with the Advanced caching

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'
);

const CACHE = 'pwabuilder-adv-cache';

workbox.setConfig({ debug: false });

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const networkFirstPaths = [
  /* Add an array of regex of paths that should go network first */
  // Example: /\/api\/.*/
  /\/icon\/.*/,
  /\/img\/.*/,
  /.*\.css/,
  /.*\.js/,
  /.*\.jpg/,
  /.*\.png/,
  /.*\.pdf/,
];

const networkOnlyPaths = [
  /* Add an array of regex of paths that should always come from the network */
  // Example: /\/api\/.*/
  /\/\/.*/,
];

networkFirstPaths.forEach((path) => {
  workbox.routing.registerRoute(
    new RegExp(path),
    new workbox.strategies.CacheFirst({
      cacheName: CACHE,
    })
  );
});

networkOnlyPaths.forEach((path) => {
  workbox.routing.registerRoute(
    new RegExp(path),
    new workbox.strategies.NetworkOnly({
      cacheName: CACHE,
    })
  );
});
