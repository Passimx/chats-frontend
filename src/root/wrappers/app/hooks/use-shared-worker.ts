import { DataType } from '../../../types/events/event-data.type.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { useCallback, useEffect } from 'react';
import { useAppEvents } from './use-app-events.hook.ts';

export const useSharedWorker = () => {
    const sendMessage = useAppEvents();

    const runConnection = useCallback(() => {
        // const BC_CHANNEL = new BroadcastChannel('chat_channel');
        // const SOCKET_INTERVAL_CONNECTION = 1000;
        // const SOCKET: WebSocket | null = null;
        //
        // if (SOCKET) return;
        // SOCKET = new WebSocket(Envs.notificationsServiceUrl);
        //
        // SOCKET.addEventListener('message', (event) => {
        //     const data = JSON.parse(event.data);
        //     sendMessage({ ...data, payload: data.data });
        // });
        //
        // SOCKET.addEventListener('close', () => {
        //     SOCKET?.close();
        //     SOCKET = null;
        //         sendMessage({ event: EventsEnum.CLOSE_SOCKET });
        //         sendMessage({ event: EventsEnum.ERROR, data: 'Cannot connect to notifications service.' });
        //         runConnection();
        //         // BC_CHANNEL.postMessage({ type: 'NEW_MESSAGE', data }); // 🔥 Рассылаем другим вкладкам
        // });
        //
        // setTimeout(runConnection, SOCKET_INTERVAL_CONNECTION);
    }, []);

    useEffect(() => {
        runConnection();

        if (!navigator.serviceWorker) return;

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/worker.js', { scope: '/' });
            });
        }

        const connectWs = () =>
            navigator.serviceWorker.controller?.postMessage({
                event: 'CONNECT',
                payload: Envs.notificationsServiceUrl,
            });

        navigator.serviceWorker.ready.then(() => {
            connectWs();
            navigator.serviceWorker.addEventListener('message', (ev: MessageEvent<DataType>) => {
                sendMessage(ev.data);
            });
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') connectWs();
        });
    }, []);
};
