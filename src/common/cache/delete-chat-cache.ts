import { Envs } from '../config/envs/envs.ts';

export const deleteChatCache = async (chatId: string): Promise<void> => {
    const cache = await caches.open(Envs.cache.files);
    const requests = await cache.keys();

    await Promise.all(
        requests.map((request) => {
            if (request.url.includes(`/files/${chatId}/`)) {
                return cache.delete(request);
            }
        }),
    );
};
