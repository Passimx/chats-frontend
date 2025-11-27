import { IData } from '../index.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { MimeToExt, Types, UploadResultType } from '../../types/files/types.ts';
import { cacheIsExist } from '../../../common/cache/cache-is-exist.ts';
import { getRawChat, getRawCryptoKey } from '../../store/raw/chats.raw.ts';
import { canSaveCache, getCacheMemory } from '../../../common/cache/get-cache-memory.ts';
import { StateType } from '../../store/app/types/state.type.ts';
import { MessagesService } from '../../../common/services/messages.service.ts';
import { CryptoService } from '../../../common/services/crypto.service.ts';
import { store } from '../../store';

export const uploadFile = async (formData: FormData): Promise<IData<UploadResultType>> => {
    const body = await MessagesService.encryptFormData(formData);
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

export const DownloadFilePreview = async (file: Types): Promise<Blob | undefined> => {
    const metadata = file.metadata;
    const cache = await caches.open(Envs.cache.files);
    const cacheUrl = `/${file.chatId}/${metadata.previewId}`;
    const url = `${Envs.filesServiceUrl}${cacheUrl}`;

    if (!metadata.previewId || !metadata.previewMimeType || !metadata.previewSize) return;

    const result = await cacheIsExist(cacheUrl);
    if (result) return new Blob([result], { type: metadata.previewMimeType });

    const response = await fetch(url);
    let blob = await response.blob();
    if (!blob) return;

    const aesKey = getRawCryptoKey(file.chatId);
    if (aesKey) {
        blob = await CryptoService.decryptFile(blob, metadata.previewMimeType, aesKey);
    }

    const responseCopy = new Response(blob, {
        headers: {
            'X-Id': metadata.previewId,
            'X-Key': metadata.previewId!,
            'X-Chat-Id': file.chatId,
            'X-Message-Id': file.messageId,
            'Content-Type': metadata.previewMimeType,
            'Content-Length': `${metadata.previewSize}`,
            'X-Created-At': `${file.createdAt}`,
            'X-File-Type': file.fileType,
            'X-Preview-Id': metadata.previewId,
            'X-Cached-Time': `${Date.now()}`,
        },
    });

    const canSave = await canSaveCache(responseCopy);
    if (canSave) await cache.put(url, responseCopy);

    return blob;
};

export const DownloadFileWithPercents = async (
    file: Types,
    setCountLoadParts: (value?: number) => void,
    setStateApp: (value: Partial<StateType>) => void,
): Promise<Blob | undefined> => {
    const result = await cacheIsExist(`/${file.chatId}/${file.key}`);
    if (result) {
        setCountLoadParts(undefined);
        return new Blob([result], { type: file.mimeType });
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
                let blob = xhr.response as Blob;
                if (getRawChat(file.chatId)) {
                    const cache = await caches.open(Envs.cache.files);

                    const aesKey = getRawCryptoKey(file.chatId);
                    if (aesKey) blob = await CryptoService.decryptFile(blob, file.mimeType, aesKey);

                    const response = new Response(blob, {
                        headers: {
                            'X-Id': file.id,
                            'X-Key': file.key,
                            'X-Chat-Id': file.chatId,
                            'X-Message-Id': file.messageId,
                            'Content-Type': file.mimeType,
                            'Content-Length': `${file.size}`,
                            'X-Created-At': `${file.createdAt}`,
                            'X-File-Type': file.fileType,
                            'X-Preview-Id': file.metadata.previewId ?? '',
                            'X-Cached-Time': `${Date.now()}`,
                        },
                    });

                    const canSave = await canSaveCache(response);
                    if (canSave) {
                        await cache.put(url, response);
                        setStateApp(await getCacheMemory());
                    }
                }

                cancelRequestMap.delete(file.id);
                resolve(new Blob([blob], { type: file.mimeType }));
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

export const shareFile = (file: Partial<Types>, blob: Blob) => {
    let filename = file.originalName || 'file';
    const mimeToExt = MimeToExt.get(file.mimeType!);

    if (mimeToExt && !filename.endsWith(mimeToExt) && !filename.endsWith('.jpg')) filename = `${filename}.${mimeToExt}`;

    const myFile = new File([blob], filename, { type: file.mimeType });
    const canShare = navigator.canShare && navigator.canShare({ files: [myFile] });
    const isPhone = store.getState().app.isPhone;

    if (isPhone && canShare) {
        try {
            navigator.share({
                files: [myFile],
            });
        } catch (e) {
            DownloadFileOnDevice(myFile, blob);
            console.error(e);
        }
    } else {
        DownloadFileOnDevice(myFile, blob);
    }
};

const DownloadFileOnDevice = async (file: File, blob: Blob): Promise<Blob | undefined> => {
    const filename = file.name;
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
