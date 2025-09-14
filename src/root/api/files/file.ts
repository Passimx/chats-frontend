import { IData } from '../index.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { Types } from '../../types/files/types.ts';

export const uploadFile = async (body: FormData): Promise<IData<string>> => {
    const response = await fetch(`${Envs.chatsServiceUrl}/files/upload`, { method: 'POST', body }).then((response) =>
        response.json(),
    );

    return response as IData<string>;
};

const filesCacheName = 'files-cache-name';
const cancelRequestMap = new Set<string>();
const xhrMap: Map<string, XMLHttpRequest> = new Map();

export const CancelDownload = (file: Types) => {
    cancelRequestMap.add(file.id);
    xhrMap.get(file.id)?.abort();
};

export const DownloadFileWithPercents = async (
    file: Types,
    setCountLoadParts: (value: number) => void,
): Promise<Blob | undefined> => {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const url = `${Envs.chatsServiceUrl}/files/${file.id}`;
        xhrMap.set(file.id, xhr);
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();

        xhr.onprogress = (e) => {
            if (cancelRequestMap.has(file.id)) xhr.abort();
            setCountLoadParts((e.loaded / e.total) * 100);
        };

        xhr.onerror = () => {
            cancelRequestMap.delete(file.id);
            resolve(undefined);
        };

        xhr.onload = async () => {
            if (xhr.status === 200 && !cancelRequestMap.has(file.id)) {
                const cache = await caches.open(filesCacheName);
                const response = new Response(xhr.response);
                await cache.put(url, response);

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

export const DownloadFile = async (file: Types): Promise<Blob | undefined> => {
    const response = await fetch(`${Envs.chatsServiceUrl}/files/${file.id}`);

    if (!response.ok) {
        return undefined;
    }

    const blob = await response.blob();
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
