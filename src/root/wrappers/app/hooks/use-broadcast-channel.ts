import { useEffect } from 'react';
import { useAppEvents } from './use-app-events.hook.ts';
import { rawApp } from '../../../store/app/app.raw.ts';

export enum TabEvents {
    CREATE_TAB = 'create_tab',
    SYNC_TAB = 'sync_tab',
    DELETE_TAB = 'delete_tab',
}

export const useBroadcastChannel = () => {
    const sendMessage = useAppEvents();

    useEffect(() => {
        const channel = new BroadcastChannel('ws-channel');

        const instanceId = crypto.randomUUID();
        rawApp.tabs = [instanceId];

        const getMain = () => {
            if ((rawApp.tabs[0] === instanceId) === rawApp.isMainTab) return;

            rawApp.isMainTab = rawApp.tabs[0] === instanceId;
            if (rawApp.isMainTab) {
                const iframeExist = document.querySelector('iframe[data-main-iframe]');
                if (!iframeExist) {
                    const iframe = document.createElement('iframe');
                    iframe.src = 'iframe.html';
                    iframe.style.display = 'none';
                    iframe.setAttribute('data-main-iframe', 'true'); // для надёжного поиска
                    document.body.appendChild(iframe);
                }
            } else {
                const iframe = document.querySelector('iframe[data-main-iframe]');
                iframe?.remove();
            }
        };

        const createTab = (tab: string) => {
            rawApp.tabs = Array.from(new Set([...rawApp.tabs, tab])).sort();
            channelSend.postMessage({ event: TabEvents.SYNC_TAB, data: rawApp.tabs });
        };

        const syncTabs = (tabs: string[]) => {
            rawApp.tabs = Array.from(new Set([...rawApp.tabs, ...tabs])).sort();
        };

        const deleteTab = (tab: string) => {
            const set = new Set(rawApp.tabs);
            set.delete(tab);
            rawApp.tabs = Array.from(set).sort();
        };

        channel.onmessage = ({ data }: MessageEvent<any>) => {
            switch (data.event) {
                case TabEvents.CREATE_TAB:
                    createTab(data.data);
                    getMain();
                    break;
                case TabEvents.SYNC_TAB:
                    syncTabs(data.data);
                    getMain();
                    break;
                case TabEvents.DELETE_TAB:
                    deleteTab(data.data);
                    getMain();
                    break;
                default:
                    sendMessage(data);
                    break;
            }
        };

        const channelSend = new BroadcastChannel('ws-channel');
        channelSend.postMessage({ event: TabEvents.CREATE_TAB, data: instanceId });

        window.addEventListener('beforeunload', () => {
            const channelSend = new BroadcastChannel('ws-channel');
            channelSend.postMessage({ event: TabEvents.DELETE_TAB, data: instanceId });
        });
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
