import { useEffect } from 'react';
import { rawApp } from '../../../store/app/app.raw.ts';
import { TabsEnum } from '../../../types/events/tabs.enum.ts';
import { useAppAction } from '../../../store';

export const useMainTab = () => {
    const { setStateApp } = useAppAction();

    useEffect(() => {
        const channel = new BroadcastChannel('ws-channel');
        const instanceId = Date.now();
        rawApp.tabs = [instanceId];

        const getMain = () => {
            if ((rawApp.tabs[0] === instanceId) === rawApp.isMainTab) return;
            rawApp.isMainTab = rawApp.tabs[0] === instanceId;
            setStateApp({ isActiveTab: rawApp.tabs[0] === instanceId });
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

        const channelSend = new BroadcastChannel('ws-channel');
        channelSend.postMessage({ event: TabsEnum.CREATE_TAB, data: instanceId });

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
            }
        };

        window.addEventListener('beforeunload', () => {
            const channelSend = new BroadcastChannel('ws-channel');
            channelSend.postMessage({ event: TabsEnum.DELETE_TAB, data: instanceId });
        });
    }, []);
};
