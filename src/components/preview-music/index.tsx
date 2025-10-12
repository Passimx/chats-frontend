import { FC, useContext } from 'react';
import { PropsType } from './props.type.ts';
import styles from './index.module.css';
import { useFileSize } from '../../common/hooks/use-file-size.ts';
import { MdDeleteOutline } from 'react-icons/md';
import { ContextMedia } from '../preview-media-context';
import { IoMusicalNotesSharp } from 'react-icons/io5';

export const PreviewMusic: FC<PropsType> = ({ file, number }) => {
    const size = useFileSize(file.size);
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
