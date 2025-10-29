import { FC, memo, useContext } from 'react';
import { PropsType } from './props.type.ts';
import styles from './index.module.css';
import { MdDeleteOutline } from 'react-icons/md';
import { ContextMedia } from '../preview-media-context';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { EditFileName } from '../edit-file-name';

export const PreviewMusic: FC<PropsType> = memo(({ file, number }) => {
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
            <EditFileName {...{ file, number }} />
            <div className={styles.styles_background} onClick={() => deleteFile(number)}>
                <MdDeleteOutline className={styles.logo_delete} />
            </div>
        </div>
    );
});
