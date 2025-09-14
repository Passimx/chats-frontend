import { Envs } from '../config/envs/envs.ts';

export const cacheIsExist = async (key: string): Promise<Blob | undefined> => {
    if (!('caches' in window)) {
        console.warn('Cache API не поддерживается вашим браузером');
        return undefined;
    }

    const cacheNames = await caches.keys();

    for (const name of cacheNames) {
        const cache = await caches.open(name);
        const match = await cache.match(`${Envs.chatsServiceUrl}${key}`);
        if (match) {
            return match.blob();
        }
    }
    return undefined;
};
