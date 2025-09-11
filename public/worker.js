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
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                // сначала пробуем найти именно этот запрос (/, /route, /?t=1 …)
                let cachedResponse = await cache.match(request);

                // если нет — пробуем index.html
                if (!cachedResponse) {
                    cachedResponse = await cache.match('/index.html');
                }

                // параллельно тянем сеть
                const fetchPromise = fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone()); // кэшируем именно URL
                            cache.put('/index.html', networkResponse.clone()); // и index.html на всякий случай
                            return networkResponse;
                        }
                        return null;
                    })
                    .catch(() => null);

                // всегда что-то возвращаем
                if (cachedResponse) {
                    fetchPromise; // обновление в фоне
                    return cachedResponse;
                }

                const networkResponse = await fetchPromise;
                if (networkResponse) return networkResponse;

                // fallback оффлайн
                return new Response('<h1>Offline</h1>', {
                    headers: { 'Content-Type': 'text/html' },
                });
            }),
        );
        return;
    }

    const url = new URL(request.url);

    if (url.pathname === '/manifest.webmanifest') {
        event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
        return;
    }

    if (url.pathname.includes('/assets/') || url.pathname.includes('/files/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(request);
                if (cachedResponse) {
                    // запускаем обновление в фоне
                    //     fetch(request).then((networkResponse) => {
                    //         if (networkResponse && networkResponse.status === 200) {
                    //             cache.put(request, networkResponse.clone());
                    //         }
                    //     });

                    return cachedResponse;
                }
                // Нет кеша — делаем запрос
                else {
                    const networkResponse = await fetch(request);
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(request, networkResponse.clone());
                    }
                    return networkResponse;
                }
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
