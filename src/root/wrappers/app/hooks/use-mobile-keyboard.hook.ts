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

            setTimeout(() => {
                alert(JSON.stringify([height, window.innerHeight]));
            }, 5000);

            if (height < window.innerHeight - 100) setStateApp({ isOpenMobileKeyboard: true });
            else setStateApp({ isOpenMobileKeyboard: false });
        };

        window.visualViewport?.addEventListener('resize', handler);
        return () => window.visualViewport?.removeEventListener('resize', handler);
    }, [isPhone]);

    useEffect(() => {
        const lockScroll = () => {
            setStateApp({ isOpenMobileKeyboard: true });
        };

        const unlockScroll = () => {
            setStateApp({ isOpenMobileKeyboard: false });
        };

        window.addEventListener('focusin', lockScroll); // iOS Safari когда клавиатура появляется
        window.addEventListener('focusout', unlockScroll); // когда скрывается

        return () => {
            window.removeEventListener('focusin', lockScroll);
            window.removeEventListener('focusout', unlockScroll);
        };
    }, []);
};
