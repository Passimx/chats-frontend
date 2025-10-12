import { JSX } from 'react';

export enum TabEnum {
    CHATS = 'chats',
    SETTINGS = 'settings',
    SERVICES = 'services',
}

export type SettingsType = {
    lang?: string;

    messagesLimit: number;
    messageSaveCount?: number;
    messageSaveTime?: number;

    autoUploadVoiceMessage?: number;
};

export type StateType = {
    isOnline: boolean;
    isOpenPage: boolean;
    activeTab: TabEnum;
    pages: Map<TabEnum, JSX.Element[]>;
    page?: JSX.Element;
    socketId?: string;
    isListening?: boolean;
    isLoadedChatsFromIndexDb?: boolean;
    isPhone?: boolean;
    systemChatId?: string;
    isOpenMobileKeyboard?: boolean;
    useMemory?: number;
    cacheMemory?: number;
    totalMemory?: number;
    isStandalone: boolean;
    isIos?: boolean;
    logs?: string[];

    batteryLevel?: number;
    batteryCharging?: boolean;
    batterySaverMode?: boolean;

    settings: SettingsType;
};
