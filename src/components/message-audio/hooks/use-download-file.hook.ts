import { Types } from '../../../root/types/files/types.ts';
import { MouseEvent, useCallback, useContext, useEffect, useState } from 'react';
import { cacheIsExist } from '../../../common/cache/cache-is-exist.ts';
import { Return } from '../types.ts';
import { AudioPlayerContext } from '../../../root/contexts/audio-player';
import { CancelDownload, DownloadFileWithPercents, shareFile } from '../../../root/api/files';
import { CanPlayAudio } from '../../../common/hooks/can-play-audio.hook.ts';
import { useAppAction, useAppSelector } from '../../../root/store';

export const useDownloadFile = (file: Types): Return => {
    const [downloadPercent, setDownloadPercent] = useState<number>();
    const [blob, setBlob] = useState<Blob>();
    const { addFile, play, pause, isPlaying, audio } = useContext(AudioPlayerContext)!;
    const { setStateApp } = useAppAction();
    const { isPhone } = useAppSelector((state) => state.app);

    useEffect(() => {
        cacheIsExist(`/${file.chatId}/${file.key}`).then((result) => {
            if (result) setBlob(result);
        });
    }, [file]);

    const downloadOnDevice = useCallback(
        async (e: MouseEvent<unknown>) => {
            e.stopPropagation();
            let duplicateBlob = blob;
            if (!duplicateBlob) {
                duplicateBlob = await DownloadFileWithPercents(file, setDownloadPercent, setStateApp);
                if (!duplicateBlob) return;
                setBlob(duplicateBlob);
            }

            shareFile(file, duplicateBlob);
        },
        [file, blob, isPhone],
    );

    const clickFile = useCallback(async () => {
        // Остановить скачивание
        if (downloadPercent !== undefined) {
            CancelDownload(file);
            setDownloadPercent(undefined);
            return;
        }

        // Скачать
        if (!blob) {
            const blob = await DownloadFileWithPercents(file, setDownloadPercent, setStateApp);
            if (!blob) return;
            setBlob(blob);

            // сразу воспроизводим аудио после загрузки
            if (CanPlayAudio(file)) {
                addFile({ file, blob });
                await play();
            }
        }

        if (CanPlayAudio(file)) {
            // Воспроизвести
            if (blob && (!isPlaying || audio?.file.id !== file.id)) {
                if (audio?.file.id !== file.id) addFile({ file, blob });
                await play();
            }

            // Остановить
            if (isPlaying && audio?.file.id === file.id) {
                pause();
            }
        }
    }, [file, blob, downloadPercent, isPlaying, audio]);

    return { downloadPercent, clickFile, blob, downloadOnDevice };
};
