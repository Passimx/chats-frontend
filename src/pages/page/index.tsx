import { FC, memo, useEffect } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { ImCancelCircle } from 'react-icons/im';

export const Page: FC = memo(() => {
    const page = useAppSelector((state) => state.app.page);
    const { setStateApp } = useAppAction();

    useEffect(() => {
        if (!page) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setStateApp({ page: undefined });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [page]);

    if (page)
        return (
            <div className={styles.background}>
                {page}
                <div className={styles.cancel_background} onClick={() => setStateApp({ page: undefined })}>
                    <ImCancelCircle className={styles.cancel_button} />
                </div>
            </div>
        );
});
