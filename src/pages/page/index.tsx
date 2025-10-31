import { FC, memo, useEffect } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { MdOutlineClose } from 'react-icons/md';
import { setThemeColor } from '../../common/hooks/set-theme-color.ts';

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

    useEffect(() => {
        if (!page) setThemeColor('#062846');
        else setThemeColor('#02101C');
    }, [page]);

    if (page)
        return (
            <div className={styles.background}>
                {page}
                <div className={styles.cancel_background} onClick={() => setStateApp({ page: undefined })}>
                    <MdOutlineClose className={styles.cancel_button} />
                </div>
            </div>
        );
});
