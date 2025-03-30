const CACHE_NAME = 'site-cache-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/index.html', '/manifest.webmanifest'])),
    );
    self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
    const request = event.request;

    if (request.mode === 'navigate') {
        event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
        return;
    }

    const url = new URL(request.url);

    if (url.pathname === '/manifest.webmanifest') {
        event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
        return;
    }

    if (url.pathname.includes('/assets/')) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone(); // 🛠 клон ДО использования

                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }

                        return networkResponse;
                    })
                    .catch(() => cachedResponse); // оффлайн — вернуть кэш, если есть

                return cachedResponse || fetchPromise;
            }),
        );
    }
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
