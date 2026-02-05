import { FC, memo, useContext } from 'react';
import styles from './index.module.css';
import { PropsType } from './props.type';
import { ContextMedia } from '../preview-media-context';
import { MdDeleteOutline } from 'react-icons/md';

export const PreviewImage: FC<PropsType> = memo(({ file, number }) => {
    const { deleteFile } = useContext(ContextMedia)!;
    const previewId = URL.createObjectURL(file);

    return (
        <div className={styles.background}>
            <img className={styles.image_view} src={previewId} alt="image" />
            <div className={styles.delete_button} onClick={() => deleteFile(number)}>
                <MdDeleteOutline className={styles.logo_delete} />
            </div>
        </div>
    );
});
