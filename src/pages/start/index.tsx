import { FC, memo, ReactElement } from 'react';
import styles from './index.module.css';

export const StartPage: FC<{ children: ReactElement }> = memo(({ children }) => {
    return <div className={styles.background}>{children}</div>;
});
