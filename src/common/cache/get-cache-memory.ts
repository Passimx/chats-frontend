import { Envs } from '../config/envs/envs.ts';
import {
    FileExtensionEnum,
    FileMetadataType,
    FileTypeEnum,
    MimetypeEnum,
    Types,
} from '../../root/types/files/types.ts';
import { CacheCategoryType, Categories, StateType } from '../../root/store/app/types/state.type.ts';
import { getFileSize } from '../hooks/get-file-size.ts';

export const getLocalStorageSize = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        const value = localStorage.getItem(key) || '';
        total += (key.length + value.length) * 2; // UTF-16 → 2 байта на символ
    }

    return total;
};

export const getIndexedDBMemory = async (): Promise<Partial<StateType>> => {
    let indexedDBMemory: number = 0;
    if (!('indexedDB' in window)) return { indexedDBMemory: undefined };

    return new Promise<Partial<StateType>>((resolve) => {
        const req = indexedDB.databases ? indexedDB.databases() : Promise.resolve([]);
        Promise.resolve(req).then((dbList: any) => {
            if (!dbList) return resolve({ indexedDBMemory: undefined });

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
                                        indexedDBMemory += new Blob([json]).size;
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

            Promise.all(tasks).then(() => resolve({ indexedDBMemory }));
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

export const calculateFiles = (files: Types[], response: Response) => {
    const id = response.headers.get('X-Id')!;
    const key = response.headers.get('X-Key')!;
    const chatId = response.headers.get('X-Chat-Id')!;
    const messageId = response.headers.get('X-Message-Id')!;
    const originalName = response.headers.get('X-Original-Name')!;
    const mimeType = response.headers.get('Content-Type')! as MimetypeEnum;
    const size = Number(response.headers.get('Content-Length')!);
    const createdAt = new Date(response.headers.get('X-Created-At')!);
    const fileType = response.headers.get('X-File-Type')! as FileExtensionEnum;
    const metadata = {} as FileMetadataType;
    const cachedTime = Number(response.headers.get('X-Cached-Time')!);

    files.push({
        id,
        key,
        chatId,
        messageId,
        originalName,
        mimeType,
        size,
        createdAt,
        fileType,
        metadata,
        cachedTime,
    });
};

export const calculateCacheByTypes = async (
    categories: Categories,
    response: Response,
    coefficient: number = 1,
): Promise<void> => {
    const contentType = response.headers.get('Content-Type')!;
    const fileType = response.headers.get('X-File-Type')!;
    const contentLength = Number(response.headers.get('Content-Length')!);

    // изображение
    if (contentType.includes(FileTypeEnum.IMAGE)) {
        categories.photos.absoluteMemory += contentLength * coefficient;
    }
    // видео
    else if (contentType.includes(FileTypeEnum.VIDEO)) {
        categories.videos.absoluteMemory += contentLength * coefficient;
    }
    // голосовые
    else if (fileType === FileExtensionEnum.IS_VOICE) {
        categories.voice_messages.absoluteMemory += contentLength * coefficient;
    }
    // музыка
    else if (contentType.includes(FileTypeEnum.AUDIO)) {
        categories.music.absoluteMemory += contentLength * coefficient;
    }
    // файлы
    else {
        categories.files.absoluteMemory += contentLength * coefficient;
    }
};

const clearOldCache = async (data: Partial<StateType>): Promise<number> => {
    let cacheMemory = data.cacheMemory!;
    const categories = data.categories!;
    const files = data.files!.sort((a, b) => (a.cachedTime ?? 0) - (b.cachedTime ?? 0));

    if (cacheMemory < Envs.settings!.cacheTotalMemory!) return cacheMemory;

    const cache = await caches.open(Envs.cache.files);
    const [file] = files;
    const response = (await cache.match(`${Envs.filesServiceUrl}/${file.chatId}/${file.key}`))!;
    await calculateCacheByTypes(categories, response, -1);
    await cache.delete(`${Envs.filesServiceUrl}/${file.chatId}/${file.key}`);
    cacheMemory -= file.size;
    files.shift();

    return clearOldCache({ cacheMemory, categories, files });
};

export const getCacheMemory = async (): Promise<Partial<StateType>> => {
    let cacheMemory = 0;
    const files: Types[] = [];

    if (!('caches' in window)) {
        console.log('Cache API не поддерживается');
        return { cacheMemory };
    }

    const cache = await caches.open(Envs.cache.files);
    const requests = await cache.keys();

    // удаление всего кеша
    if (!Envs.settings?.cache) {
        await Promise.all(requests.map((request) => cache.delete(request)));
        return { cacheMemory };
    }

    let categories: Categories = {
        photos: { absoluteMemory: 0, unit: { memory: '', unit: '' } },
        videos: { absoluteMemory: 0, unit: { memory: '', unit: '' } },
        music: { absoluteMemory: 0, unit: { memory: '', unit: '' } },
        files: { absoluteMemory: 0, unit: { memory: '', unit: '' } },
        voice_messages: { absoluteMemory: 0, unit: { memory: '', unit: '' } },
    };

    for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
            const size = Number(response.headers.get('Content-Length')!);
            const canSave = await canSaveCache(response);
            if (!canSave) {
                await cache.delete(request);
                continue;
            }

            calculateFiles(files, response);
            await calculateCacheByTypes(categories, response);

            cacheMemory += size;
        }
    }

    // сброс лишнего кэша
    if (Envs.settings.cacheTotalMemory !== undefined && cacheMemory > Envs.settings.cacheTotalMemory) {
        cacheMemory = await clearOldCache({ cacheMemory, files, categories });
    }

    categories = Object.fromEntries(
        Object.entries<CacheCategoryType>(categories).map(([key, category]) => {
            const [memory, unit] = getFileSize(category.absoluteMemory);
            return [key, { absoluteMemory: category.absoluteMemory, unit: { memory, unit } }];
        }),
    ) as Categories;

    // байт
    return { cacheMemory, categories };
};
