import { useAppAction } from '../../../store';
import { useEffect } from 'react';

export const useIsPhone = () => {
    const { setStateApp } = useAppAction();

    useEffect(() => {
        const resize = () => {
            const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
            const isPhone = toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
            setStateApp({ isPhone });
        };

        resize();

        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);
};
