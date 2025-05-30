import { FC } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import styles from './index.module.css';

export const RotateLoading: FC = () => {
    return (
        <div id={styles.logos_block}>
            <AiOutlineLoading3Quarters className={styles.loading_logo} />
        </div>
    );
};
