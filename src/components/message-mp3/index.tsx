import { FC, memo, useContext, useMemo } from 'react';
import { PropsType } from './props.type.ts';
import { getFileSize } from '../../common/hooks/get-file-size.ts';
import styles from './index.module.css';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { BsDownload } from 'react-icons/bs';
import { useDownloadFile } from '../message-audio/hooks/use-download-file.hook.ts';
import { LoadRadius } from '../load-radius';
import { AudioPlayerContext } from '../../root/contexts/audio-player';
import { FaPause, FaPlay } from 'react-icons/fa';
import { MdDownloadForOffline } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useDownloadPreview } from '../../common/hooks/use-download-preview.hook.ts';

export const MessageMp3: FC<PropsType> = memo(({ file }) => {
    const r = 17;
    const strokeWidth = 3;
    const { t } = useTranslation();
    const { isPlaying, audio } = useContext(AudioPlayerContext)!;
    const backgroundImage = useDownloadPreview(file);
    const { downloadPercent, blob, clickFile, downloadOnDevice } = useDownloadFile(file);

    const size = useMemo(() => {
        const [memory, unit] = getFileSize(file.size);
        return `${memory} ${t(unit)}`;
    }, [file.size]);

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
