import { FC, memo, useEffect, useState } from 'react';
import styles from './index.module.css';
import styles2 from '../../index.module.css';
import { useAppAction, useAppSelector } from '../../../../root/store';
import { TabEnum } from '../../../../root/store/app/types/state.type.ts';
import { useVisibility } from '../../../../common/hooks/use-visibility.hook.ts';

export const NavigationItem: FC<{ children: JSX.Element; index: number }> = memo(({ children, index }) => {
    const id = `navigation_item_${index}`;
    const { setStateApp } = useAppAction();
    const [observerTarget, visible] = useVisibility();
    const [isActive, setIsActive] = useState<boolean>(false);
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);

    useEffect(() => {
        if (visible) setIsActive(true);
    }, [visible]);

    useEffect(() => {
        if (!pages) return;
        if (visible) return;
        if (!isActive) return;

        const element = document.getElementById(styles2.page)!;
        const activePageIndex = element.scrollLeft / element.clientWidth;
        if (activePageIndex >= index) return;

        pages.splice(index, 1);
        setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, pages]]) });
    }, [index, pages, visible, isActive]);

    useEffect(() => {
        if (!pages?.length) return;
        const element = document.getElementById(styles2.page)!;
        element.scrollTo({ left: element.clientWidth * pages.length, behavior: 'smooth' });
    }, [pages]);

    return (
        <div id={id} ref={observerTarget} className={styles.background}>
            {children}
        </div>
    );
});
