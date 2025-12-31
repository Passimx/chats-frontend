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
    const [isTextLoading, setIsTextLoading] = useState<boolean>(false);
    const { isPlaying, audio, progress } = useContext(AudioPlayerContext)!;
    const [transcription, setTranscription] = useState(file.metadata.transcriptionVoice);
    const [time, setTime] = useState<string>(getStringDuration(file?.metadata?.duration));
    const constDuration = useMemo(() => getStringDuration(file?.metadata?.duration), []);

    const showTranslation = useCallback(() => {
        const textElement = document.getElementById(idText)!;
        const textBackgroundElement = document.getElementById(idTextBackground)!;

        if (!isVisible) {
            textBackgroundElement.style.maxWidth = '1000px';
            setTimeout(() => {
                textBackgroundElement.style.maxHeight = `${textElement.scrollHeight}px`;
            }, 300);
        } else {
            textBackgroundElement.style.maxHeight = '0';
            setTimeout(() => {
                textBackgroundElement.style.maxWidth = '0';
            }, 300);
        }

        setIsVisible(!isVisible);
    }, [transcription, isVisible]);

    const clickTextButton = useCallback(async () => {
        if (transcription !== undefined) return showTranslation();
        if (isTextLoading) return;

        setIsTextLoading(!isTextLoading);
        const result = await getFile(file.messageId, file.id);

        if (!result.success) {
            setIsTextLoading(false);
            return;
        }

        const transcriptionVoice = result.data.metadata.transcriptionVoice;
        if (transcriptionVoice === undefined) {
            setTimeout(() => {
                setIsTextLoading(false);
                clickTextButton();
            }, 3000);
            return;
        }

        setIsTextLoading(false);
        setTranscription(transcriptionVoice);
        updateFile(result.data);
        showTranslation();
    }, [isTextLoading, showTranslation]);

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
                        {isPlaying && audio?.file.id === file.id && <FaPause className={styles.pause_button} />}
                        {downloadPercent !== undefined && <div className={styles.pause_button}>X</div>}
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
                                <div
                                    className={`${styles.audio_text} ${isTextLoading && styles.audio_text_load} text_translate`}
                                    onClick={clickTextButton}
                                >
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
