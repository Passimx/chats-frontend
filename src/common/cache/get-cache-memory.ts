export const getCacheMemory = async (): Promise<number> => {
    if (!('caches' in window)) {
        console.log('Cache API не поддерживается');
        return 0;
    }

    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                try {
                    const blob = await response.clone().blob();
                    totalSize += blob.size;
                } catch {
                    // Некоторые ресурсы могут быть не клонируемы
                }
            }
        }
    }

    // байт
    return totalSize;
};
