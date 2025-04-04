import { useEffect } from 'react';
import { useAppEvents } from './use-app-events.hook.ts';
import { rawApp } from '../../../store/app/app.raw.ts';

export const useBroadcastChannel = () => {
    const sendMessage = useAppEvents();

    useEffect(() => {
        const channel = new BroadcastChannel('ws-channel');
        const instanceId = crypto.randomUUID();
        let claimTimeout: number;

        const pingMainTab = () => {
            if (rawApp.isMainTab) return;
            channel.postMessage({ event: 'ping', data: instanceId });

            claimTimeout = setTimeout(() => {
                becomeOwner();
            }, 500);

            setTimeout(pingMainTab, 1000);
        };

        pingMainTab();

        channel.onmessage = ({ data }: MessageEvent<any>) => {
            switch (data.event) {
                case 'pong':
                    clearTimeout(claimTimeout);
                    if (rawApp.isMainTab) break;
                    console.log('[INFO] Владение уже занято. Подключаемся как слушатель.');
                    break;
            }

            sendMessage(data);
        };

        function becomeOwner() {
            const iframe = document.createElement('iframe');
            iframe.src = 'iframe.html';
            iframe.style.display = 'none';
            rawApp.isMainTab = true;
            document.body.appendChild(iframe);
            console.log('[OWNER] Становимся владельцем, создаём iframe');
        }
    }, []);

    useEffect(() => {
        if (navigator.serviceWorker) {
            navigator.serviceWorker?.register('/worker.js', { scope: '/' });
            navigator.serviceWorker?.ready?.then((registration) => {
                return (registration as any)?.sync?.register('syncdata');
            });
        }
    }, []);
};
