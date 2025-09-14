import { Types } from '../../../root/types/files/types.ts';
import { useCallback, useContext, useEffect, useState } from 'react';
import { cacheIsExist } from '../../../common/cache/cache-is-exist.ts';
import { Return } from '../types.ts';
import { AudioPlayerContext } from '../../../root/contexts/audio-player';
import { CancelDownload, DownloadFileWithPercents } from '../../../root/api/files/file.ts';
import { CanPlayAudio } from '../../../common/hooks/can-play-audio.hook.ts';

export const useDownloadFile = (file: Types): Return => {
    const [downloadPercent, setDownloadPercent] = useState<number>();
    const [blob, setBlob] = useState<Blob>();
    const { addFile, play, pause, isPlaying, audio } = useContext(AudioPlayerContext)!;

    useEffect(() => {
        cacheIsExist(`/files/${file.id}`).then((result) => {
            if (result) setBlob(result);
        });
    }, [file]);

    useEffect(() => {
        if (downloadPercent === 100) setDownloadPercent(undefined);
    }, [downloadPercent]);

    const clickFile = useCallback(async () => {
        // Остановить скачивание
        if (downloadPercent !== undefined) {
            CancelDownload(file);
            setDownloadPercent(undefined);
            return;
        }

        // Скачать
        if (!blob) {
            setDownloadPercent(0);
            const blob = await DownloadFileWithPercents(file, setDownloadPercent);
            if (!blob) return;
            setBlob(blob);
            // сразу воспроизводим аудио после загрузки
            if (CanPlayAudio(file)) {
                addFile({ file, blob });
                await play();
            }
        }

        if (!CanPlayAudio(file)) return;

        // Воспроизвести
        if (blob && (!isPlaying || audio?.file.id !== file.id)) {
            if (audio?.file.id !== file.id) addFile({ file, blob });
            await play();
        }

        // Остановить
        if (isPlaying && audio?.file.id === file.id) {
            pause();
        }
    }, [file, blob, downloadPercent, isPlaying, audio]);

    return [downloadPercent, clickFile, blob];
};
