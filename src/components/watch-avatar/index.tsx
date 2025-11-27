import { FC, memo } from 'react';
import { PropsType } from './types.ts';
import styles from './index.module.css';

export const WatchAvatar: FC<PropsType> = memo(({ images }) => {
    return <div className={styles.background}>{images?.length}</div>;
});
