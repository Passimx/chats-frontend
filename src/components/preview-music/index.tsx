import { FC, useContext, useMemo } from 'react';
import { PropsType } from './props.type.ts';
import styles from './index.module.css';
import { getFileSize } from '../../common/hooks/get-file-size.ts';
import { MdDeleteOutline } from 'react-icons/md';
import { ContextMedia } from '../preview-media-context';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

export const PreviewMusic: FC<PropsType> = ({ file, number }) => {
    const { t } = useTranslation();

    const size = useMemo(() => {
        const [memory, unit] = getFileSize(file.size);
        return `${memory} ${t(unit)}`;
    }, [file.size]);

    const { deleteFile } = useContext(ContextMedia)!;

    const previewId = file.metaData?.previewId;

    return (
        <div className={styles.background}>
            <div>
                {previewId && <img src={file.metaData?.previewId} className={styles.file_preview_image} />}
                {!previewId && (
                    <div className={styles.file_logo_background}>
                        <IoMusicalNotesSharp className={styles.file_logo} />
                    </div>
                )}
            </div>
            <div className={`${styles.file_inf} text_translate`}>
                <div className={styles.file_name}>{file.name}</div>
                <div className={styles.file_size}>{size}</div>
            </div>
            <div className={styles.styles_background} onClick={() => deleteFile(number)}>
                <MdDeleteOutline className={styles.logo_delete} />
            </div>
        </div>
    );
};
