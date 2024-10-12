import { FC } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';

const Loading: FC<PropsType> = ({ children, isLoading, loadingComponent }) => {
    return (
        <div id={styles.background}>
            <div className={isLoading ? styles.show : styles.hide}>{loadingComponent}</div>
            <div className={isLoading ? styles.hide : styles.show}>
                <>{children}</>
            </div>
        </div>
    );
};

export default Loading;
