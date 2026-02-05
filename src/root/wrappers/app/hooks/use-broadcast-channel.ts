import { useEffect } from 'react';
import { useAppEvents } from './use-app-events.hook.ts';
import { useAppAction, useAppSelector } from '../../../store';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';

let worker: Worker | undefined;
export const useBroadcastChannel = () => {
    const sendMessage = useAppEvents();
    const token = useAppSelector((state) => state.user.token);
    const isActiveTab = useAppSelector((state) => state.app.isActiveTab);
    const { setStateApp } = useAppAction();

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
        if (!isActiveTab) return;

        if (token) {
            if (!worker)
                worker = new Worker(new URL('../../../api/notifications/notifications.ts', import.meta.url), {
                    type: 'module',
                });

            worker.postMessage({
                event: EventsEnum.CONNECT_NOTIFICATIONS,
                data: { token },
            });
        } else {
            worker?.terminate();
            worker = undefined;
            setStateApp({ socketId: undefined, isListening: false });
        }
    }, [token, isActiveTab]);
};
