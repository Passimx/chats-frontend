const CACHE_NAME = 'static-v-0.0.2';

const OFFLINE_ASSETS = ['/', '/index.html', '/iframe.html', '/manifest.webmanifest', '/assets/'];

// Определяем, является ли запрос статическим файлом
function isStaticAsset(request) {
    const url = new URL(request.url);
    return (
        url.origin === self.location.origin &&
        (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.html') || url.pathname.endsWith('.webmanifest'))
    );
}

// Устанавливаем сервис-воркер и кэшируем основные файлы
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(OFFLINE_ASSETS);
        }),
    );
    self.skipWaiting();
});

// Активация — удаляем старые кэши
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))),
    );
    self.clients.claim();
});

// Fetch — стратегия "Cache First, then update in background"
self.addEventListener('fetch', (event) => {
    console.log(event.request.url);
    const request = event.request;

    // Только GET запросы
    if (request.method !== 'GET') return;

    // Для API и внешних запросов — пропускаем
    if (!isStaticAsset(request)) return;

    event.respondWith(
        caches.match(request).then((cached) => {
            // Параллельно пробуем обновить из сети, но не блокируем ответ
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return networkResponse;
                })
                .catch(() => null);

            // Возвращаем кэш сразу (офлайн работает)
            return cached || fetchPromise || caches.match('/index.html');
        }),
    );
});

// ✅ Для iOS и Safari: обязательно обработай offline fallback
self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.mode === 'navigate') {
        event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    }
});
