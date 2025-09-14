import { FC, memo, useContext } from 'react';
import { PropsType } from './types.ts';
import styles from './index.module.css';
import { useDownloadFile } from './hooks/use-download-file.hook.ts';
import { LoadRadius } from '../load-radius';
import { FaPause, FaPlay } from 'react-icons/fa';
import { AudioPlayerContext } from '../../root/contexts/audio-player';

export const AudioFile: FC<PropsType> = memo(({ file }) => {
    const r = 17;
    const strokeWidth = 3;
    const [downloadPercent, clickFile] = useDownloadFile(file);
    const { isPlaying, audio } = useContext(AudioPlayerContext)!;

    return (
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
    );
});
