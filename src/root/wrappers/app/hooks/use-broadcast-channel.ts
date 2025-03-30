import { useEffect } from 'react';
import { useAppEvents } from './use-app-events.hook.ts';
import { rawApp } from '../../../store/app/app.raw.ts';

export const useBroadcastChannel = () => {
    const sendMessage = useAppEvents();

    useEffect(() => {
        const channel = new BroadcastChannel('ws-channel');
        const instanceId = crypto.randomUUID();

        channel.postMessage({ event: 'ping', data: instanceId });

        const claimTimeout = setTimeout(() => {
            becomeOwner();
        }, 500);

        channel.onmessage = ({ data }: MessageEvent<any>) => {
            switch (data.event) {
                case 'pong':
                    clearTimeout(claimTimeout);
                    console.log('[INFO] Владение уже занято. Подключаемся как слушатель.');
                    channel.postMessage({ event: 'get_socket' });
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
