const CACHE_NAME = 'static-v-0.0.1';
function isStaticAsset(request) {
    const url = new URL(request.url);

    return (
        url.pathname.startsWith('/assets/') || url.pathname.endsWith('.html') || url.pathname.endsWith('.webmanifest')
    );
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(['/', '/index.html', '/iframe.html', '/manifest.webmanifest'])),
    );
    self.skipWaiting();
});

// Запросы
self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') return;

    if (!isStaticAsset(request)) return;

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                return cached; // берём из кэша
            }

            return fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, clone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() =>
                    // если оффлайн и в кэше нет
                    caches.match('/index.html'),
                );
        }),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((name) => {
                        if (name !== CACHE_NAME) {
                            return caches.delete(name);
                        }
                    }),
                );
            })
            .then(() => self.clients.claim()), // ⚡ Новый SW моментально управляет страницей
    );
});
