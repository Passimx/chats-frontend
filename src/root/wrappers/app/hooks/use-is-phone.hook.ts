import { useAppAction } from '../../../store';
import { useEffect } from 'react';

export const useIsPhone = () => {
    const { setStateApp } = useAppAction();

    useEffect(() => {
        const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
        const isPhone = toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));

        setStateApp({ isPhone });
        window.addEventListener('resize', () => setStateApp({ isPhone }));
    }, []);
};
