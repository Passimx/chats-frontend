import { FC, memo, useCallback, useEffect } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { MdOutlineClose } from 'react-icons/md';
import { setThemeColor } from '../../common/hooks/set-theme-color.ts';
import useClickOutside from '../../common/hooks/use-click-outside.ts';

export const Page: FC = memo(() => {
    const { setStateApp } = useAppAction();
    const [ref, isVisible, setIsVisible] = useClickOutside();
    const page = useAppSelector((state) => state.app.page);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') setStateApp({ page: undefined });
    }, []);

    useEffect(() => {
        setIsVisible(!!page);
    }, [page]);

    useEffect(() => {
        if (isVisible) {
            setThemeColor('#02101C');
            window.addEventListener('keydown', handleKeyDown);
        }

        if (!isVisible) {
            setThemeColor('#062846');
            setStateApp({ page: undefined });
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isVisible]);

    if (page)
        return (
            <div className={styles.background}>
                <div ref={ref} style={{ cursor: 'auto' }}>
                    {page}
                </div>
                <div className={styles.cancel_background}>
                    <MdOutlineClose className={styles.cancel_button} />
                </div>
            </div>
        );
});
