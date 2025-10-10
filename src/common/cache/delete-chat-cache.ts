import { Envs } from '../config/envs/envs.ts';

export const deleteCacheOne = async (key: string): Promise<void> => {
    const cache = await caches.open(Envs.cache.files);
    await cache.delete(`${Envs.filesServiceUrl}${key}`);
};

export const deleteChatCache = async (chatId: string): Promise<void> => {
    const cache = await caches.open(Envs.cache.files);
    const requests = await cache.keys();

    await Promise.all(
        requests.map((request) => {
            if (request.url.includes(`/files/${chatId}/`)) {
                request.clone();
                return cache.delete(request);
            }
        }),
    );
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
