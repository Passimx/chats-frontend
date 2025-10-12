import { useEffect } from 'react';
import { useAppAction } from '../../../store';

export const useIsIos = () => {
    const { setStateApp } = useAppAction();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const ua = navigator.userAgent || navigator.vendor || window.opera;

        // Всё, что относится к экосистеме Apple
        const isIOS = /iPad|iPhone|iPod/.test(ua);
        const isMac = /Macintosh|Mac OS X/.test(ua);

        // iPadOS 13+ маскируется под Mac, проверим тач
        const isIPadOS = isMac && 'ontouchend' in document;

        setStateApp({ isIos: isIOS || isMac || isIPadOS });
    }, []);
};
