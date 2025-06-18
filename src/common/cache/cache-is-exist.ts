import { Envs } from '../config/envs/envs.ts';

export const cacheIsExist = async (key: string): Promise<boolean> => {
    if (!('caches' in window)) {
        console.warn('Cache API не поддерживается вашим браузером');
        return false;
    }

    const cacheNames = await caches.keys();

    for (const name of cacheNames) {
        const cache = await caches.open(name);
        const match = await cache.match(`${Envs.chatsServiceUrl}${key}`);
        if (match) {
            return true;
        }
    }
    return false;
};
