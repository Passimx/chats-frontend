import { useEffect } from 'react';
import { Envs } from '../../../../common/config/envs/envs.ts';

export const useUpdateStaticCache = () => {
    const getArrayFromText = (text: string) => {
        const textArray = text.trim().replace(/ {2}/g, '\n').split('\n');
        const files: { hash: string; name: string }[] = [];
        for (let i = 0; i < textArray.length; i += 2) {
            files.push({ hash: textArray[i], name: textArray[i + 1] });
        }

        return files;
    };

    useEffect(() => {
        const update = async () => {
            const request = '/dist.sha256';

            const cache = await caches.open(Envs.cache.static);
            const dist = await cache.match(request);
            const networkResponse = await fetch(request);

            if (!networkResponse || networkResponse.status !== 200) return;
            if (!dist) {
                const clone = networkResponse.clone();
                return caches.open(Envs.cache.static).then((cache) => cache.put(request, clone));
            }

            const [textFromServer, textFromCache] = await Promise.all([networkResponse.text(), dist.text()]);
            // полное совпадение
            if (textFromServer === textFromCache) return;

            const [filesFromServer, filesFromCache] = await Promise.all([
                getArrayFromText(textFromServer),
                getArrayFromText(textFromCache),
            ]);

            // удаление неактуальных файлов
            for (const file of filesFromCache) {
                const findFile = filesFromServer.find((fileFromServer) => fileFromServer.hash === file.hash);
                if (!findFile) await cache.delete(file.name);
            }

            // загрузка недостающих
            for (const file of filesFromServer) {
                const findFile = filesFromCache.find((fileFromCache) => fileFromCache.hash === file.hash);
                if (findFile) continue;

                // сохранение в кеш на стороне сервис воркера
                await fetch(file.name);
            }

            await cache.put(request, networkResponse.clone());
        };

        window.addEventListener('load', update);
        return () => window.removeEventListener('load', update);
    }, []);
};
