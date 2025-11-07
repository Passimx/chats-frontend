import { Envs } from '../config/envs/envs.ts';

export const deleteCacheOne = async (key: string): Promise<void> => {
    const cache = await caches.open(Envs.cache.files);
    await cache.delete(`${Envs.filesServiceUrl}${key}`);
};

// возвращает размер удаленного кеша
export const deleteChatCache = async (chatId: string): Promise<number> => {
    let totalSize = 0;
    const cache = await caches.open(Envs.cache.files);
    const requests = await cache.keys();

    for (const request of requests) {
        const response = await cache.match(request);
        if (response && request.url.includes(`/files/${chatId}/`)) {
            const size = Number(response.headers.get('Content-Length')!);
            await cache.delete(request);
            totalSize += size;
        }
    }

    return totalSize;
};

export const deleteAllCache = async (): Promise<void> => {
    const cache = await caches.open(Envs.cache.files);
    const requests = await cache.keys();

    await Promise.all(
        requests.map((request) => {
            request.clone();
            return cache.delete(request);
        }),
    );
};
