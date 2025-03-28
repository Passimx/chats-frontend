const CACHE_NAME = 'site-cache';

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/index.html'])));
    self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
    const request = event.request;
    if (request.mode === 'navigate') {
        // запрос за HTML-документом
        event.respondWith(fetch(request).catch(() => caches.match('/index.html', '/manifest.webmanifest')));
        return;
    }
    const url = new URL(request.url);

    if (url.pathname.includes('/assets/')) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, networkResponse.clone());
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => cachedResponse); // если оффлайн — вернуть кэш, если он есть

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

// const CACHE_NAME = 'site-cache-v1';
//
// // Расширения файлов, которые мы хотим кэшировать
// const CACHE_FILE_EXTENSIONS = ['.js', '.css'];
//
// self.addEventListener('install', (event) => {
//     console.log('[SW] Install');
//     self.skipWaiting(); // сразу активировать SW без ожидания загрузки страницы
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(['/', '/index.html', '/manifest.webmanifest']);
//         }),
//     );
// });
//
// self.addEventListener('activate', (event) => {
//     console.log('[SW] Activate');
//     event.waitUntil(
//         caches.keys().then((cacheNames) =>
//             Promise.all(
//                 cacheNames.map((name) => {
//                     if (name !== CACHE_NAME) {
//                         console.log('[SW] Deleting old cache:', name);
//                         return caches.delete(name);
//                     }
//                 }),
//             ),
//         ),
//     );
//     self.clients.claim(); // взять под контроль существующие вкладки
// });
//
// self.addEventListener('fetch', (event) => {
//     const { request } = event;
//
//     // Только GET-запросы
//     if (request.method !== 'GET') return;
//
//     const url = new URL(request.url);
//     const pathname = url.pathname;
//
//     // Проверка: содержит ли путь нужное расширение?
//     const shouldCache = CACHE_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext));
//
//     if (!shouldCache) return; // не кешируем другие типы запросов (например, изображения)
//
//     event.respondWith(
//         caches.match(request).then((cachedResponse) => {
//             const fetchPromise = fetch(request)
//                 .then((networkResponse) => {
//                     // Если получен валидный ответ — сохранить в кэш
//                     if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
//                         caches.open(CACHE_NAME).then((cache) => {
//                             cache.put(request, networkResponse.clone());
//                         });
//
//                         // (необязательно) отправить сообщение на клиент
//                         self.clients.matchAll().then((clients) => {
//                             clients.forEach((client) => {
//                                 client.postMessage({
//                                     type: 'CACHE_UPDATED',
//                                     url: request.url,
//                                 });
//                             });
//                         });
//                     }
//
//                     return networkResponse;
//                 })
//                 .catch(() => {
//                     // Возвращаем кэш, если fetch не удался (оффлайн)
//                     return cachedResponse;
//                 });
//
//             // Если есть кэш — отдать его сразу, и обновить в фоне
//             return cachedResponse || fetchPromise;
//         }),
//     );
// });
