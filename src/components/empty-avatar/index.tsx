import { FC, memo } from 'react';
import styles from './index.module.css';
import { MdPhotoCamera } from 'react-icons/md';

export const EmptyAvatar: FC = memo(() => {
    return (
        <div className={styles.background}>
            <MdPhotoCamera className={styles.camera_icon} />
        </div>
    );
});
