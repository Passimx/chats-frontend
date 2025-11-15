import { FC, memo, useMemo } from 'react';
import { PropsType } from './props.type.ts';
import { getFileSize } from '../../common/hooks/get-file-size.ts';
import styles from './index.module.css';
import { BsDownload } from 'react-icons/bs';
import { useDownloadFile } from '../message-audio/hooks/use-download-file.hook.ts';
import { LoadRadius } from '../load-radius';
import { MdDownloadForOffline } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useVisibility } from '../../common/hooks/use-visibility.hook.ts';
import { GoVideo } from 'react-icons/go';
import { useDownloadPreview } from '../../common/hooks/use-download-preview.hook.ts';

export const MessageVideo: FC<PropsType> = memo(({ file }) => {
    const { t } = useTranslation();
    const r = 17;
    const strokeWidth = 3;
    const [observerTarget] = useVisibility();
    const backgroundImage = useDownloadPreview(file);
    const { downloadPercent, blob, clickFile, downloadOnDevice } = useDownloadFile(file);

    const size = useMemo(() => {
        const [memory, unit] = getFileSize(file.size);
        return `${memory} ${t(unit)}`;
    }, [file.size]);

    return (
        <div
            onClick={clickFile}
            ref={observerTarget}
            className={`${styles.background} ${!blob && styles.background_animation}`}
        >
            <div className={styles.file_background} style={{ backgroundImage }}>
                {downloadPercent === undefined && (
                    <div className={styles.file_icon}>
                        <GoVideo className={styles.file_logo} />
                        <BsDownload className={styles.download_logo} />
                    </div>
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
