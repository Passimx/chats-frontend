import { FC, useEffect, useState } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';

const Loading: FC<PropsType> = ({ children, isLoading, loadingComponent }) => {
    const [isInit, setIsInit] = useState<boolean>(false);

    useEffect(() => {
        if (isLoading) setIsInit(true);
    }, [isLoading]);

    return (
        <div>
            <div
                id={styles.loading}
                className={`${!isLoading && isInit && styles.hide} ${!isInit && styles.is_not_init}`}
            >
                {loadingComponent}
            </div>
            <div id={styles.content}>
                <>{children}</>
            </div>
        </div>
    );
};

export default Loading;
