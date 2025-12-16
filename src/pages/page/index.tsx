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
        if (page?.type.name !== 'CallModal') setIsVisible(!!page);
    }, [page]);

    useEffect(() => {
        if (page?.type.name !== 'CallModal') {
            if (isVisible) {
                setThemeColor('#02101C');
                window.addEventListener('keydown', handleKeyDown);
            }

            if (!isVisible) {
                setThemeColor('#062846');
                setStateApp({ page: undefined });
                window.removeEventListener('keydown', handleKeyDown);
            }
        }
    }, [isVisible]);

    if (page) {
        if (page.type.name === 'CallModal') {
            return <div ref={ref}>{page}</div>;
        }
        return (
            <div className={styles.background}>
                <div className={styles.page}>{page}</div>
                <div className={styles.cancel_background}>
                    <MdOutlineClose className={styles.cancel_button} />
                </div>
            </div>
        );
    }
});
