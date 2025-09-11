import { useCallback, useContext, useEffect, useState } from 'react';
import { Envs } from '../../../common/config/envs/envs.ts';
import { Types } from '../../../root/types/files/types.ts';
import { AudioPlayerContext } from '../../../root/contexts/audio-player';
import { cacheIsExist } from '../../../common/cache/cache-is-exist.ts';

const readerMap: Map<string, ReadableStreamDefaultReader> = new Map();
const stopReaderSet: Set<string> = new Set();

export const useLoad = (fileAudio: Types): [number] => {
    const { setAudio, play, pause } = useContext(AudioPlayerContext)!;

    const [countLoadParts, setCountLoadParts] = useState<number>(0);
    const [blob, setBlob] = useState<Blob>();

    useEffect(() => {
        const playButton = document.getElementById(`play_background_${fileAudio.id}`)!;
        const cancelButton = document.getElementById(`cancel_background_${fileAudio.id}`)!;
        const downloadButton = document.getElementById(`download_button_${fileAudio.id}`)!;

        if (countLoadParts === 0) {
            cancelButton.style.visibility = 'hidden';
            playButton.style.visibility = 'hidden';
            downloadButton.style.visibility = 'visible';
        } else if (countLoadParts === 100) {
            cancelButton.style.visibility = 'hidden';
            downloadButton.style.visibility = 'hidden';
            playButton.style.visibility = 'visible';
        } else {
            downloadButton.style.visibility = 'hidden';
            cancelButton.style.visibility = 'visible';
        }
    }, [countLoadParts]);

    const load = useCallback(async () => {
        if (blob) return;
        const cancelButton = document.getElementById(`cancel_background_${fileAudio.id}`)!;

        const response = await fetch(`${Envs.chatsServiceUrl}/files/${fileAudio.id}`);

        if (!response.ok) throw new Error('Ошибка загрузки');
        if (!response.body) throw new Error('ReadableStream не поддерживается');

        const reader = response.body.getReader();

        let loadedBytes = 0;
        const chunks: BlobPart[] = [];
        readerMap.set(fileAudio.id, reader);

        let partBytes = 0;

        const pump = async (): Promise<unknown> => {
            if (stopReaderSet.has(fileAudio.id)) {
                await cancel();
                stopReaderSet.delete(fileAudio.id);
                return;
            }

            const { done, value } = await reader.read();
            if (done) return;

            // Обновляем прогресс
            loadedBytes += value.length;
            chunks.push(value);

            const part = fileAudio.size / 100;

            if (loadedBytes >= part * (partBytes + 1)) {
                partBytes = parseInt(`${loadedBytes / part}`);
                setCountLoadParts(partBytes);
                cancelButton.style.backgroundImage = `conic-gradient(#0a4375 ${partBytes}%, transparent ${partBytes}%)`;
            }

            return pump();
        };

        await pump();

        if (loadedBytes === fileAudio.size) {
            const blob = new Blob(chunks);
            setBlob(blob);
            setCountLoadParts(100);
            partBytes = 100;
        }

        readerMap.delete(fileAudio.id);
    }, [blob]);

    const loadFromCache = useCallback(async () => {
        const isExist = await cacheIsExist(`/files/${fileAudio.id}`);
        if (isExist) load();
    }, []);

    const cancel = useCallback(async () => {
        const reader = readerMap.get(fileAudio.id);
        if (reader) {
            await reader.cancel();
            readerMap.delete(fileAudio.id);
        } else stopReaderSet.add(fileAudio.id);

        setCountLoadParts(0);
        const cancelButton = document.getElementById(`cancel_background_${fileAudio.id}`)!;
        cancelButton.style.backgroundImage = `conic-gradient(#0a4375 ${0}%, transparent ${0}%)`;
    }, []);

    useEffect(() => {
        // если файл меньше 1МБ - то загрузка автоматически
        if (fileAudio.size / 1024 / 1024 < 1 && countLoadParts === 0) load();
        // если файл есть в кеше - загружаем его
        else loadFromCache();

        return () => {
            Array.from(readerMap).forEach((values) => values[1].cancel());
        };
    }, []);

    useEffect(() => {
        const playButton = document.getElementById(`play_${fileAudio.id}`)!;
        const pauseButton = document.getElementById(`pause_${fileAudio.id}`)!;
        const cancelButton = document.getElementById(`cancel_background_${fileAudio.id}`)!;
        const downloadButton = document.getElementById(`download_button_${fileAudio.id}`)!;

        const download = async () => {
            if (!stopReaderSet.has(fileAudio.id)) {
                setCountLoadParts(1);
                await load();
            }
        };

        const playSound = async () => {
            playButton.style.visibility = 'hidden';
            pauseButton.style.visibility = 'visible';

            setAudio({ id: fileAudio.id, blob: blob! });
            await play();
            playButton.style.visibility = 'visible';
            pauseButton.style.visibility = 'hidden';
        };

        const pauseSound = () => {
            playButton.style.visibility = 'visible';
            pauseButton.style.visibility = 'hidden';
            pause();
        };

        playButton.addEventListener('click', playSound);
        pauseButton.addEventListener('click', pauseSound);
        cancelButton.addEventListener('click', cancel);
        downloadButton.addEventListener('click', download);

        return () => {
            playButton.removeEventListener('click', playSound);
            pauseButton.removeEventListener('click', pauseSound);
            cancelButton.removeEventListener('click', cancel);
            cancelButton.removeEventListener('click', download);
        };
    }, [blob]);

    return [countLoadParts];
};
