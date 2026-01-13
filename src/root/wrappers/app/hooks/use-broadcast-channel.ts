import { useEffect } from 'react';
import { useAppEvents } from './use-app-events.hook.ts';
import { useAppSelector } from '../../../store';
import { Envs } from '../../../../common/config/envs/envs.ts';

export const useBroadcastChannel = () => {
    const sendMessage = useAppEvents();
    const rsaPublicKey = useAppSelector((state) => state.user.rsaPublicKey);
    const isActiveTab = useAppSelector((state) => state.app.isActiveTab);

    /** App events */
    useEffect(() => {
        const channel = new BroadcastChannel('ws-channel');
        channel.onmessage = ({ data }: MessageEvent<any>) => sendMessage(data);
    }, []);

    /** Service worker registration */
    useEffect(() => {
        if (navigator.serviceWorker) {
            navigator.serviceWorker?.register('/worker.js', { scope: '/' });
            navigator.serviceWorker?.ready?.then((registration) => {
                if (registration.active) registration.active?.postMessage({ type: 'SET_ENVS', data: Envs });
                return (registration as any)?.sync?.register('syncdata');
            });
        }
    }, []);

    /** Notifications service connection */
    useEffect(() => {
        if (!rsaPublicKey) return;

        if (isActiveTab) {
            const iframeExist = document.querySelector('iframe[data-main-iframe]');
            if (!iframeExist) {
                const iframe = document.createElement('iframe');
                iframe.src = '/iframe.html';
                iframe.style.display = 'none';
                iframe.setAttribute('data-main-iframe', 'true');
                document.body.appendChild(iframe);
            }
        } else {
            const iframe = document.querySelector('iframe[data-main-iframe]');
            iframe?.remove();
        }
    }, [rsaPublicKey, isActiveTab]);
};
