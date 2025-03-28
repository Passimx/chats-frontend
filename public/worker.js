const CACHE_NAME = 'site-cache-v1';

// Расширения файлов, которые мы хотим кэшировать
const CACHE_FILE_EXTENSIONS = ['.html', '.js', '.css', '.webmanifest'];

self.addEventListener('install', () => {
    console.log('[SW] Install');
    self.skipWaiting(); // сразу активировать SW без ожидания загрузки страницы
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activate');
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    }
                }),
            ),
        ),
    );
    self.clients.claim(); // взять под контроль существующие вкладки
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Только GET-запросы
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Проверка: содержит ли путь нужное расширение?
    const shouldCache = CACHE_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext));

    if (!shouldCache) return; // не кешируем другие типы запросов (например, изображения)

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    // Если получен валидный ответ — сохранить в кэш
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, networkResponse.clone());
                        });

                        // (необязательно) отправить сообщение на клиент
                        self.clients.matchAll().then((clients) => {
                            clients.forEach((client) => {
                                client.postMessage({
                                    type: 'CACHE_UPDATED',
                                    url: request.url,
                                });
                            });
                        });
                    }

                    return networkResponse;
                })
                .catch(() => {
                    // Возвращаем кэш, если fetch не удался (оффлайн)
                    return cachedResponse;
                });

            // Если есть кэш — отдать его сразу, и обновить в фоне
            return cachedResponse || fetchPromise;
        }),
    );
});
