const CACHE_NAME = 'edumatch-pwa-v1';
const CORE_SHELL_URLS = [
  '/',
  '/?source=pwa',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];

function cacheIfEligible(request, response) {
  if (!response || !response.ok || response.type !== 'basic') return undefined;
  const copy = response.clone();
  return caches
    .open(CACHE_NAME)
    .then((cache) => cache.put(request, copy))
    .catch(() => undefined);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const putPromise = cacheIfEligible(request, response);
          if (putPromise) event.waitUntil(putPromise);
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match('/'))
            .then((fallback) => fallback || new Response('Offline', { status: 503, statusText: 'Offline' })),
        ),
    );
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/manifest.webmanifest'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            const putPromise = cacheIfEligible(request, response);
            if (putPromise) event.waitUntil(putPromise);
            return response;
          })
          .catch(() => cached || new Response('', { status: 503, statusText: 'Offline' }));
        event.waitUntil(networkFetch.catch(() => undefined));
        return cached || networkFetch;
      }),
    );
  }
});
