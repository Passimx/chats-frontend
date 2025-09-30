import { Envs } from '../config/envs/envs.ts';

export const cacheIsExist = async (key: string): Promise<Blob | undefined> => {
    if (!('caches' in window)) {
        console.warn('Cache API не поддерживается вашим браузером');
        return undefined;
    }

    const cache = await caches.open(Envs.cache.files);
    const match = await cache.match(`${Envs.filesServiceUrl}${key}`);
    return match?.blob();
};
