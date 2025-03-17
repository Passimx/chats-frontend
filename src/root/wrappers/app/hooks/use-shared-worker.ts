import { Envs } from '../../../../common/config/envs/envs.ts';
import { useCallback, useEffect } from 'react';
import { useAppEvents } from './use-app-events.hook.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';

const SOCKET_INTERVAL_CONNECTION = 1000;
let SOCKET: WebSocket | null = null;

export const useSharedWorker = () => {
    const sendMessage = useAppEvents();

    const runConnection = useCallback(() => {
        if (SOCKET?.readyState === WebSocket.OPEN) return;

        SOCKET = new WebSocket(Envs.notificationsServiceUrl);
        SOCKET.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            sendMessage(data);
        });

        SOCKET.addEventListener('close', () => {
            SOCKET?.close();
            SOCKET = null;
            sendMessage({ event: EventsEnum.CLOSE_SOCKET });
            sendMessage({ event: EventsEnum.ERROR, data: 'Cannot connect to notifications service.' });
            runConnection();
        });

        setTimeout(runConnection, SOCKET_INTERVAL_CONNECTION);
    }, []);

    // const reconnectSW = () =>
    //     navigator.serviceWorker.controller?.postMessage({
    //         event: 'RE_CONNECT',
    //         payload: Envs.notificationsServiceUrl,
    //     });

    // const runServiceWorker = () => {
    //     window.addEventListener('load', () => {
    //         navigator.serviceWorker.register('/worker.js', { scope: '/' });
    //     });
    //
    //     const connectWs = () =>
    //         navigator.serviceWorker.controller?.postMessage({
    //             event: 'CONNECT',
    //             payload: Envs.notificationsServiceUrl,
    //         });
    //
    //     navigator.serviceWorker.ready.then(() => {
    //         connectWs();
    //         navigator.serviceWorker.addEventListener('message', (ev: MessageEvent<DataType>) => {
    //             sendMessage(ev.data);
    //         });
    //     });
    // };

    useEffect(() => {
        runConnection();
        // if (!navigator.serviceWorker) runConnection();
        // else runServiceWorker();

        document.addEventListener('visibilitychange', () => {
            runConnection();
            // if (document.visibilityState === 'visible') {
            //     if (!navigator.serviceWorker) runConnection();
            //     if (navigator.serviceWorker) reconnectSW();
            // }
        });
    }, []);
};
