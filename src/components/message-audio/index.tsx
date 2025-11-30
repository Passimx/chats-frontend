import { FC, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PropsType } from './types.ts';
import styles from './index.module.css';
import { useDownloadFile } from './hooks/use-download-file.hook.ts';
import { LoadRadius } from '../load-radius';
import { FaPause, FaPlay } from 'react-icons/fa';
import { AudioPlayerContext } from '../../root/contexts/audio-player';
import { LoudnessBars } from '../lound-data';
import { getStringDuration } from '../../common/hooks/get-string-duration.hook.ts';
import { useVisibility } from '../../common/hooks/use-visibility.hook.ts';
import { useTranslation } from 'react-i18next';
import { getFile } from '../../root/api/files';
import { useAppAction } from '../../root/store';

export const AudioFile: FC<PropsType> = memo(({ file }) => {
    const r = 17;
    const strokeWidth = 3;
    const { t } = useTranslation();
    const idText = `text_${file.id}`;
    const { updateFile } = useAppAction();
    const [observerTarget] = useVisibility();
    const idTextBackground = `text_background_${file.id}`;
    const [isVisible, setIsVisible] = useState<boolean>();
    const { downloadPercent, clickFile } = useDownloadFile(file);
    const { isPlaying, audio, progress } = useContext(AudioPlayerContext)!;
    const [transcription, setTranscription] = useState(file.metadata.transcriptionVoice);
    const [time, setTime] = useState<string>(getStringDuration(file?.metadata?.duration));

    const constDuration = useMemo(() => getStringDuration(file?.metadata?.duration), []);

    useEffect(() => {
        const textElement = document.getElementById(idText)!;
        const textBackgroundElement = document.getElementById(idTextBackground)!;
        textBackgroundElement.style.transition = `all ${Math.max(textElement.scrollHeight, 300)}ms`;
    }, [idText, idTextBackground]);

    const clickTextButton = useCallback(async () => {
        const textElement = document.getElementById(idText)!;
        const textBackgroundElement = document.getElementById(idTextBackground)!;

        if (transcription !== undefined) {
            if (!isVisible) textBackgroundElement.style.maxHeight = `${textElement.scrollHeight}px`;
            else textBackgroundElement.style.maxHeight = '0px';
            setIsVisible(!isVisible);
        } else {
            const result = await getFile(file.messageId, file.id);
            if (!result.success) return;

            setTranscription(result.data.metadata.transcriptionVoice);
            setIsVisible(true);
            updateFile(result.data);
            textBackgroundElement.style.maxHeight = `${textElement.scrollHeight}px`;
        }
    }, [isVisible, transcription]);

    useEffect(() => {
        const duration = file?.metadata?.duration;
        if (!duration) return;
        if (audio?.file.id !== file.id) return setTime(constDuration);

        const current = duration * (progress ?? 0);
        const newTime = getStringDuration(Math.floor(current));
        if (newTime === time) return;

        setTime(newTime);
    }, [audio?.file.id === file.id, constDuration, progress]);

    return (
        <div className={styles.main_background}>
            <div className={styles.main} ref={observerTarget}>
                <div className={styles.background} onClick={clickFile}>
                    <div className={styles.background_play}>
                        {downloadPercent === undefined && (!isPlaying || audio?.file.id !== file.id) && (
                            <FaPlay className={styles.play_button} />
                        )}
                        {isPlaying && audio?.file.id === file.id && <FaPause className={styles.play_button} />}
                        {downloadPercent !== undefined && <div className={styles.play_button}>X</div>}
                    </div>
                    <div className={styles.background_stop}>
                        {downloadPercent !== undefined && (
                            <LoadRadius radius={r} strokeWidth={strokeWidth} percent={downloadPercent} />
                        )}
                    </div>
                </div>
                <div>
                    <div className={styles.duration}>
                        <div className={styles.audio_background}>
                            <LoudnessBars file={file} />
                            {transcription !== null && (
                                <div className={`${styles.audio_text} text_translate`} onClick={clickTextButton}>
                                    {t('T')}
                                </div>
                            )}
                        </div>
                        <div className={styles.duration_text}>{time}</div>
                    </div>
                </div>
            </div>
            <div id={idTextBackground} className={styles.text_background}>
                <div id={idText} className={styles.text_main}>
                    {transcription?.length ? transcription : '...'}
                </div>
            </div>
        </div>
    );
});
