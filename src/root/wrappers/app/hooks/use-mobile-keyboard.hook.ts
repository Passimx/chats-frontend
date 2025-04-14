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

            if (height < window.innerHeight - 100) setStateApp({ isOpenMobileKeyboard: true });
            else setStateApp({ isOpenMobileKeyboard: true });
        };

        window.visualViewport?.addEventListener('resize', handler);
        return () => window.visualViewport?.removeEventListener('resize', handler);
    }, [isPhone]);
};
