let Envs;
const CACHE_NAME = 'static-files';
const OFFLINE_ASSETS = [
    '/',
    '/index.html',
    '/iframe.html',
    '/manifest.webmanifest',
    '/main.css',
    '/main.js',
    '/iframe.js',
    '/worker.js',
];

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
        caches.open(Envs?.cache?.files || CACHE_NAME).then((cache) => {
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
    const requestUrl = new URL(event.request.url);

    // CSRF secure
    if (Envs?.allowUrls?.length && !Envs?.allowUrls.includes(requestUrl.host)) {
        // qr-code module
        if (requestUrl.href.includes('zxing_reader.wasm')) {
            const request = await fetch('/assets/modules/qr-code/zxing_reader.wasm');
            request.mimeType = 'application/wasm';
            return event.respondWith(request);
        }

        console.log(`Blocking cross-origin request: ${event.request.url}`);
        event.respondWith(Response.error());
        return;
    }

    if (request.method !== 'GET') return;
    if (!isStaticAsset(request)) return;

    event.respondWith(
        caches.match(request).then(async (cached) => {
            if (cached) return cached;

            const networkResponse = await fetch(request);
            if (networkResponse && networkResponse.status === 200 && isStaticAsset(request)) {
                const clone = networkResponse.clone();
                caches.open(Envs?.cache?.files || CACHE_NAME).then((cache) => cache.put(request, clone));
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

// Принимаем сообщение с данными
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SET_ENVS') Envs = event.data.data;
});
