const CACHE_NAME = 'site-cache';
const URLS_TO_CACHE = [
    '/', // Главная страница
    '/index.html',
    '/style.css',
    '/app.js',
];

// Установка Service Worker и начальное кэширование
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Precaching App Shell');
            return cache.addAll(URLS_TO_CACHE);
        }),
    );
});

// Активация: очистка старых кэшей
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    }
                }),
            );
        }),
    );
    return self.clients.claim();
});

// Обработка запросов — стратегия stale-while-revalidate
self.addEventListener('fetch', (event) => {
    // Только GET-запросы
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request)
                .then((networkResponse) => {
                    // Проверим, что это нормальный ответ и положим его в кэш
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                        });

                        // Дополнительно: можно отправить сообщение клиенту
                        // о том, что ресурс обновился

                        self.clients.matchAll().then((clients) => {
                            clients.forEach((client) => {
                                client.postMessage({
                                    type: 'CACHE_UPDATED',
                                    url: event.request.url,
                                });
                            });
                        });
                    }

                    return networkResponse;
                })
                .catch(() => {
                    // В случае ошибки (например, нет интернета)
                    return cachedResponse;
                });

            // Возвращаем кэш сразу, а обновление запрашиваем в фоне
            return cachedResponse || fetchPromise;
        }),
    );
});
