import { Envs } from '../config/envs/envs.ts';
import { FileExtensionEnum, FileTypeEnum } from '../../root/types/files/types.ts';

export const getLocalStorageSize = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const value = localStorage.getItem(key) || '';
        total += (key.length + value.length) * 2; // UTF-16 → 2 байта на символ
    }

    return total;
};

export const getIndexedDBMemory = async () => {
    let total = 0;
    if (!('indexedDB' in window)) return total;

    return new Promise<number>((resolve) => {
        const req = indexedDB.databases ? indexedDB.databases() : Promise.resolve([]);
        Promise.resolve(req).then((dbList: any) => {
            if (!dbList) return resolve(total);

            const tasks = dbList.map((dbInfo: any) => {
                return new Promise<void>((res) => {
                    if (!dbInfo.name) return res();
                    const openReq = indexedDB.open(dbInfo.name);
                    openReq.onsuccess = () => {
                        const db = openReq.result;
                        const storeNames = Array.from(db.objectStoreNames);
                        const storeTasks = storeNames.map((storeName) => {
                            return new Promise<void>((res2) => {
                                const tx = db.transaction(storeName);
                                const store = tx.objectStore(storeName);
                                const getAllReq = store.getAll();
                                getAllReq.onsuccess = () => {
                                    const data = getAllReq.result;
                                    try {
                                        const json = JSON.stringify(data);
                                        total += new Blob([json]).size;
                                    } catch {
                                        return 0;
                                    }
                                    res2();
                                };
                                getAllReq.onerror = () => res2();
                            });
                        });

                        Promise.all(storeTasks).then(() => {
                            db.close();
                            res();
                        });
                    };
                    openReq.onerror = () => res();
                });
            });

            Promise.all(tasks).then(() => resolve(total));
        });
    });
};

export const canSaveCache = async (response: Response): Promise<boolean> => {
    const cachedTime = Number(response.headers.get('X-Cached-Time')!) - 1000;
    const contentType = response.headers.get('Content-Type')!;
    const fileType = response.headers.get('X-File-Type')!;

    // изображение
    if (contentType.includes(FileTypeEnum.IMAGE)) {
        // если хранение кеша изображений настроено
        if (Envs.settings?.cacheImageTime !== undefined)
            if (cachedTime + Envs.settings.cacheImageTime < Date.now()) {
                return false;
            }
    }
    // видео
    else if (contentType.includes(FileTypeEnum.VIDEO)) {
        // если хранение кеша видео настроено
        if (Envs.settings?.cacheVideoTime !== undefined)
            if (cachedTime + Envs.settings.cacheVideoTime < Date.now()) {
                return false;
            }
    }
    // голосовые
    else if (fileType === FileExtensionEnum.IS_VOICE) {
        // если хранение кеша голосовых настроено
        if (Envs.settings?.cacheVoiceTime !== undefined)
            if (cachedTime + Envs.settings.cacheVoiceTime < Date.now()) {
                return false;
            }
    }
    // музыка
    else if (contentType.includes(FileTypeEnum.AUDIO)) {
        // если хранение кеша музыки настроено
        if (Envs.settings?.cacheMusicTime !== undefined)
            if (cachedTime + Envs.settings.cacheMusicTime < Date.now()) {
                return false;
            }
    }
    // файлы
    else {
        // если хранение кеша файлов настроено
        if (Envs.settings?.cacheFilesTime !== undefined)
            if (cachedTime + Envs.settings.cacheFilesTime < Date.now()) {
                return false;
            }
    }

    return true;
};

export const getCacheMemory = async (): Promise<number> => {
    if (!('caches' in window)) {
        console.log('Cache API не поддерживается');
        return 0;
    }

    const cache = await caches.open(Envs.cache.files);
    let totalSize = 0;
    const requests = await cache.keys();

    // удаление всего кеша
    if (!Envs.settings?.cache) {
        await Promise.all(requests.map((request) => cache.delete(request)));
        return 0;
    }

    for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
            const size = Number(response.headers.get('Content-Length')!);
            const canSave = await canSaveCache(response);
            if (!canSave) await cache.delete(request);

            totalSize += size;
        }
    }

    // байт
    return totalSize;
};
