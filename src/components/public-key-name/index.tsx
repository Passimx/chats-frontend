import { FC, memo, useCallback } from 'react';
import styles from './index.module.css';
import { PropsType } from './types.ts';
import { useAppAction } from '../../root/store';
import { NotFoundUsername } from '../not-found-username';

export const PublicKeyName: FC<PropsType> = memo(({ name }) => {
    const { setStateApp } = useAppAction();

    const click = useCallback(() => {
        setStateApp({ page: <NotFoundUsername /> });
    }, []);

    return (
        <div className={styles.background} onClick={click}>
            @{name}
        </div>
    );
});
