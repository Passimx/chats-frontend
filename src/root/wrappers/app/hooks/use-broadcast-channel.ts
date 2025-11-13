import { useEffect } from 'react';
import { useAppEvents } from './use-app-events.hook.ts';
import { rawApp } from '../../../store/app/app.raw.ts';
import { TabsEnum } from '../../../types/events/tabs.enum.ts';
import { useAppSelector } from '../../../store';

export const useBroadcastChannel = () => {
    const sendMessage = useAppEvents();
    const RASKeysString = useAppSelector((state) => state.app.RASKeysString);

    useEffect(() => {
        if (!RASKeysString?.publicKey) return;

        const channel = new BroadcastChannel('ws-channel');
        const instanceId = Date.now();
        rawApp.tabs = [instanceId];

        const getMain = () => {
            if ((rawApp.tabs[0] === instanceId) === rawApp.isMainTab) return;

            rawApp.isMainTab = rawApp.tabs[0] === instanceId;
            if (rawApp.isMainTab) {
                const iframeExist = document.querySelector('iframe[data-main-iframe]');
                if (!iframeExist) {
                    const iframe = document.createElement('iframe');
                    iframe.src = '/iframe.html';
                    iframe.style.display = 'none';
                    iframe.setAttribute('data-main-iframe', 'true'); // для надёжного поиска
                    document.body.appendChild(iframe);
                }
            } else {
                const iframe = document.querySelector('iframe[data-main-iframe]');
                iframe?.remove();
            }
        };

        const createTab = (tab: number) => {
            rawApp.tabs = Array.from(new Set([...rawApp.tabs, tab])).sort();
            channelSend.postMessage({ event: TabsEnum.SYNC_TAB, data: rawApp.tabs });
        };

        const syncTabs = (tabs: number[]) => {
            rawApp.tabs = Array.from(new Set([...rawApp.tabs, ...tabs])).sort();
        };

        const deleteTab = (tab: number) => {
            const set = new Set(rawApp.tabs);
            set.delete(tab);
            rawApp.tabs = Array.from(set).sort();
        };

        channel.onmessage = ({ data }: MessageEvent<any>) => {
            switch (data.event) {
                case TabsEnum.CREATE_TAB:
                    createTab(data.data);
                    getMain();
                    break;
                case TabsEnum.SYNC_TAB:
                    syncTabs(data.data);
                    getMain();
                    break;
                case TabsEnum.DELETE_TAB:
                    deleteTab(data.data);
                    getMain();
                    break;
                default:
                    sendMessage(data);
            }
        };

        const channelSend = new BroadcastChannel('ws-channel');
        channelSend.postMessage({ event: TabsEnum.CREATE_TAB, data: instanceId });

        window.addEventListener('beforeunload', () => {
            const channelSend = new BroadcastChannel('ws-channel');
            channelSend.postMessage({ event: TabsEnum.DELETE_TAB, data: instanceId });
        });
    }, [RASKeysString?.publicKey]);

    /** Service worker registration */
    useEffect(() => {
        if (navigator.serviceWorker) {
            navigator.serviceWorker?.register('/worker.js', { scope: '/' });
            navigator.serviceWorker?.ready?.then((registration) => {
                return (registration as any)?.sync?.register('syncdata');
            });
        }
    }, []);
};
