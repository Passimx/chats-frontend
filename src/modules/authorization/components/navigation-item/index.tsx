import { FC, memo, useCallback, useMemo } from 'react';
import styles from './index.module.css';
import styles2 from '../../index.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { useAppAction, useAppSelector } from '../../../../root/store';
import { TabEnum } from '../../../../root/store/app/types/state.type.ts';

export const NavigationItem: FC<{ children: JSX.Element; index: number }> = memo(({ children, index }) => {
    const { setStateApp } = useAppAction();
    const id = `navigation_item_${index}`;
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);

    const [width, height] = useMemo(() => {
        const [element] = document.getElementsByClassName(styles2.page);
        return [element.clientWidth, element.clientHeight - 32];
    }, []);

    const closePage = useCallback(() => {
        const element = document.getElementById(id)!;
        element.classList.add(styles.hide_slowly);

        setTimeout(() => {
            if (!pages) return;
            pages.splice(index, 1);
            setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, pages]]) });
        }, 200);
    }, [pages]);

    return (
        <div id={id} className={`${styles.background} ${index > 0 && styles.show_slowly}`} style={{ width, height }}>
            {index > 0 && (
                <div className={styles.arrow} onClick={closePage}>
                    <IoArrowBack size={20} />
                </div>
            )}
            {children}
        </div>
    );
});
