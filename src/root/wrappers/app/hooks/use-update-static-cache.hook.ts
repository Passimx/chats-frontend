import { useCallback, useEffect } from 'react';
import { Envs } from '../../../../common/config/envs/envs.ts';

export const useUpdateStaticCache = () => {
    const updateCacheFiles = useCallback(async () => {
        const interval = 1000;

        const cache = await caches.open(Envs.cache.static);
        const requests = await cache.keys(); // все ключи в этом кэше

        requests.map((request, index) => {
            setTimeout(async () => {
                try {
                    // todo
                    // нужно сбрасывать кеш каждый раз
                    // когда обновляется версия фронта
                    await cache.delete(request);
                } catch (e) {
                    console.warn(`Failed to update ${request.url}:`, e);
                }
            }, interval * index);
        });
    }, []);

    useEffect(() => {
        updateCacheFiles();
    }, []);
};
