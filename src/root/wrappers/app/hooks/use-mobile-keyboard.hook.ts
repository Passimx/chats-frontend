import { useEffect } from 'react';
import { useAppAction, useAppSelector } from '../../../store';

export const useMobileKeyboard = () => {
    const { setStateApp } = useAppAction();
    const { isPhone } = useAppSelector((state) => state.app);

    useEffect(() => {
        if (!isPhone) return;

        const lockScroll = () => {
            setTimeout(() => setStateApp({ isOpenMobileKeyboard: true }), 300);
        };

        const unlockScroll = () => {
            setTimeout(() => setStateApp({ isOpenMobileKeyboard: false }), 300);
        };

        window.addEventListener('focusin', lockScroll);
        window.addEventListener('focusout', unlockScroll);

        return () => {
            window.removeEventListener('focusin', lockScroll);
            window.removeEventListener('focusout', unlockScroll);
        };
    }, [isPhone]);
};
