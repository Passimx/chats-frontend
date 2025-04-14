import { useEffect } from 'react';
import { useAppSelector } from '../../../root/store';

export const useSaveHeight = () => {
    const { isOpenMobileKeyboard } = useAppSelector((state) => state.app);

    useEffect(() => {
        if (!window.Telegram?.WebApp?.initDataUnsafe?.user?.id) return;
        if (isOpenMobileKeyboard === undefined) return;

        const prevScroll = window.scrollY;

        const lockScroll = () => {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${prevScroll}px`;
            document.body.style.width = '100%';
        };

        const unlockScroll = () => {
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, prevScroll);
        };

        if (isOpenMobileKeyboard) lockScroll();
        else unlockScroll();
    }, [isOpenMobileKeyboard]);
};
