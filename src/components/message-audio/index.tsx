import { FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import { PropsType } from './types.ts';
import styles from './index.module.css';
import { useDownloadFile } from './hooks/use-download-file.hook.ts';
import { LoadRadius } from '../load-radius';
import { FaPause, FaPlay } from 'react-icons/fa';
import { AudioPlayerContext } from '../../root/contexts/audio-player';
import { LoudnessBars } from '../lound-data';
import { getStringDuration } from '../../common/hooks/get-string-duration.hook.ts';
import { useVisibility } from '../../common/hooks/use-visibility.hook.ts';

export const AudioFile: FC<PropsType> = memo(({ file }) => {
    const r = 17;
    const strokeWidth = 3;
    const { downloadPercent, clickFile } = useDownloadFile(file);
    const [time, setTime] = useState<string>(getStringDuration(file?.metadata?.duration));
    const { isPlaying, audio, progress } = useContext(AudioPlayerContext)!;
    const [observerTarget] = useVisibility();

    const constDuration = useMemo(() => getStringDuration(file?.metadata?.duration), []);

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
                    <LoudnessBars file={file} />
                    <div className={styles.duration_text}>{time}</div>
                </div>
                <div></div>
            </div>
        </div>
    );
});
