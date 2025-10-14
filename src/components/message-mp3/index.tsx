import { FC, memo, useContext, useMemo } from 'react';
import { PropsType } from './props.type.ts';
import { useFileSize } from '../../common/hooks/use-file-size.ts';
import styles from './index.module.css';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { BsDownload } from 'react-icons/bs';
import { useDownloadFile } from '../message-audio/hooks/use-download-file.hook.ts';
import { LoadRadius } from '../load-radius';
import { AudioPlayerContext } from '../../root/contexts/audio-player';
import { FaPause, FaPlay } from 'react-icons/fa';
import { MdDownloadForOffline } from 'react-icons/md';
import { Envs } from '../../common/config/envs/envs.ts';

export const MessageMp3: FC<PropsType> = memo(({ file }) => {
    const r = 17;
    const strokeWidth = 3;
    const size = useFileSize(file.size);
    const { downloadPercent, blob, clickFile, downloadOnDevice } = useDownloadFile(file);
    const { isPlaying, audio } = useContext(AudioPlayerContext)!;

    const backgroundImage = useMemo(() => {
        if (file.metadata.previewId) return `url(${Envs.filesServiceUrl}/${file.chatId}/${file.metadata.previewId})`;
        return undefined;
    }, [file.metadata.previewId]);

    return (
        <div className={`${styles.background} ${!blob && styles.background_animation}`} onClick={clickFile}>
            <div className={styles.file_background} style={{ backgroundImage }}>
                {downloadPercent === undefined && audio?.file.id !== file.id && (
                    <div className={styles.file_icon}>
                        <IoMusicalNotesSharp className={styles.file_logo} />
                        <BsDownload className={styles.download_logo} />
                    </div>
                )}

                {downloadPercent === undefined && audio?.file.id === file.id && (
                    <>
                        {isPlaying ? (
                            <FaPause className={styles.play_button} />
                        ) : (
                            <FaPlay className={styles.play_button} />
                        )}
                    </>
                )}

                {downloadPercent !== undefined && <div className={styles.stop_button}>X</div>}
                {downloadPercent !== undefined && (
                    <div className={styles.background_stop}>
                        <LoadRadius radius={r} strokeWidth={strokeWidth} percent={downloadPercent} />
                    </div>
                )}
            </div>
            <div className={styles.file_inf}>
                <div className={styles.name_background}>
                    <MdDownloadForOffline className={styles.name_background_logo} onClick={downloadOnDevice} />
                    <div className={styles.name}>{file.originalName}</div>
                </div>
                <div className={styles.size}>
                    <div>{size}</div>
                    <div>{downloadPercent !== undefined ? `(${downloadPercent?.toFixed(0)}%)` : ''}</div>
                </div>
            </div>
        </div>
    );
});
