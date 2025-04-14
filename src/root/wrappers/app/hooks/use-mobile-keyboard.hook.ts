import { useEffect } from 'react';
import { useAppAction, useAppSelector } from '../../../store';

export const useMobileKeyboard = () => {
    const { setStateApp } = useAppAction();
    const { isPhone } = useAppSelector((state) => state.app);

    useEffect(() => {
        if (!isPhone) return;

        const handler = () => {
            const height = window.visualViewport?.height;
            if (!height) return;

            setTimeout(() => setStateApp({ isOpenMobileKeyboard: height < window.innerHeight - 100 }), 300);
        };

        window.visualViewport?.addEventListener('resize', handler);
        return () => window.visualViewport?.removeEventListener('resize', handler);
    }, [isPhone]);

    // useEffect(() => {
    //     if (!isPhone) return;
    //
    //     const lockScroll = () => {
    //         setTimeout(() => setStateApp({ isOpenMobileKeyboard: true }), 300);
    //     };
    //
    //     const unlockScroll = () => {
    //         setTimeout(() => setStateApp({ isOpenMobileKeyboard: false }), 300);
    //     };
    //
    //     window.addEventListener('focusin', lockScroll); // iOS Safari когда клавиатура появляется
    //     window.addEventListener('focusout', unlockScroll); // когда скрывается
    //
    //     return () => {
    //         window.removeEventListener('focusin', lockScroll);
    //         window.removeEventListener('focusout', unlockScroll);
    //     };
    // }, [isPhone]);
};
