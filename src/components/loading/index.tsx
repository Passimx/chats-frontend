import { FC } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';

const Loading: FC<PropsType> = ({ children, isLoading, loadingComponent }) => {
    return (
        <div id={styles.background}>
            <div id={styles.loading} className={!isLoading ? styles.hide : ''}>
                {loadingComponent}
            </div>
            <div id={styles.content}>
                <>{children}</>
            </div>
        </div>
    );
};

export default Loading;
