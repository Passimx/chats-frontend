const CACHE_NAME = 'static-files';

const OFFLINE_ASSETS = ['/', '/index.html', '/iframe.html', '/manifest.webmanifest', '/assets/'];

// Определяем, является ли запрос статическим файлом
function isStaticAsset(request) {
    const url = new URL(request.url);
    return (
        url.origin === self.location.origin &&
        (url.pathname.startsWith('/assets/') ||
            url.pathname.endsWith('.html') ||
            url.pathname.endsWith('.css') ||
            url.pathname.endsWith('.js') ||
            url.pathname.endsWith('.webmanifest'))
    );
}

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(OFFLINE_ASSETS);
        }),
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', async (event) => {
    const request = event.request;

    if (request.method !== 'GET') return;
    if (!isStaticAsset(request)) return;

    event.respondWith(
        caches.match(request).then(async (cached) => {
            if (cached) return cached;

            const networkResponse = await fetch(request);
            if (networkResponse && networkResponse.status === 200 && isStaticAsset(request)) {
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }

            return networkResponse;
        }),
    );
});

// offline fallback
self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.mode === 'navigate') {
        event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    }
});
