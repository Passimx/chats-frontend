import { Envs } from '../config/envs/envs.ts';

export const getLocalStorageSize = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const value = localStorage.getItem(key) || '';
        total += (key.length + value.length) * 2; // UTF-16 → 2 байта на символ
    }

    return total;
};

export const getIndexedDBSize = async () => {
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

export const getCacheMemory = async (): Promise<number> => {
    if (!('caches' in window)) {
        console.log('Cache API не поддерживается');
        return 0;
    }

    let totalSize = 0;
    const cache = await caches.open(Envs.cache.files);
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

    // байт
    return totalSize;
};

export const getUseMemory = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const { usage } = await navigator.storage.estimate();

        if ('memory' in performance) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const usedJSHeapSize = performance.memory?.usedJSHeapSize;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const jsHeapSizeLimit = performance.memory?.jsHeapSizeLimit;

            console.log({
                used: (usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
                limit: (jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB',
            });
        }

        return usage;
    }

    const cache = await getCacheMemory();
    const indexDb = await getIndexedDBSize();
    const localStorage = getLocalStorageSize();

    return cache + localStorage + indexDb;
};
