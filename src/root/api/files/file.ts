import { IData } from '../index.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { Types, UploadResultType } from '../../types/files/types.ts';
import { cacheIsExist } from '../../../common/cache/cache-is-exist.ts';
import { getRawChat } from '../../store/chats/chats.raw.ts';

export const uploadFile = async (body: FormData): Promise<IData<UploadResultType>> => {
    const response = await fetch(`${Envs.filesServiceUrl}/upload`, { method: 'POST', body }).then((response) =>
        response.json(),
    );

    return response as IData<UploadResultType>;
};

const cancelRequestMap = new Set<string>();
const xhrMap: Map<string, XMLHttpRequest> = new Map();

export const CancelDownload = (file: Types) => {
    cancelRequestMap.add(file.id);
    xhrMap.get(file.id)?.abort();
};

export const DownloadFileWithPercents = async (
    file: Types,
    setCountLoadParts: (value?: number) => void,
): Promise<Blob | undefined> => {
    const result = await cacheIsExist(`/${file.chatId}/${file.key}`);
    if (result) {
        setCountLoadParts(undefined);
        return result;
    }

    setCountLoadParts(0);

    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const url = `${Envs.filesServiceUrl}/${file.chatId}/${file.key}`;
        xhrMap.set(file.id, xhr);
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();

        xhr.onprogress = (e) => {
            if (cancelRequestMap.has(file.id)) xhr.abort();
            const percent = (e.loaded / e.total) * 100;
            setCountLoadParts(percent !== 100 ? percent : undefined);
        };

        xhr.onerror = () => {
            cancelRequestMap.delete(file.id);
            resolve(undefined);
        };

        xhr.onload = async () => {
            if (xhr.status === 200 && !cancelRequestMap.has(file.id)) {
                if (getRawChat(file.chatId)) {
                    const cache = await caches.open(Envs.cache.files);
                    const response = new Response(xhr.response, {
                        headers: {
                            'Content-Type': xhr.getResponseHeader('Content-Type') || 'application/octet-stream',
                        },
                    });
                    await cache.put(url, response);
                }

                cancelRequestMap.delete(file.id);
                resolve(xhr.response);
            } else {
                cancelRequestMap.delete(file.id);
                resolve(undefined);
            }
        };

        xhr.onabort = () => {
            cancelRequestMap.delete(file.id);
            resolve(undefined);
        };
    });
};

export const DownloadFile = async (file: Types, blob?: Blob): Promise<Blob | undefined> => {
    if (!blob) return;

    const filename = file.originalName;
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

    return blob;
};
