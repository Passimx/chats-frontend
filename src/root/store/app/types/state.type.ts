import { JSX } from 'react';
import { Types } from '../../../types/files/types.ts';

export enum TabEnum {
    CHATS = 'chats',
    SETTINGS = 'settings',
    SERVICES = 'services',
}

export type CacheCategoryType = { absoluteMemory: number; unit: { memory: string; unit: string } };

export type Categories = {
    photos: CacheCategoryType;
    videos: CacheCategoryType;
    music: CacheCategoryType;
    files: CacheCategoryType;
    voice_messages: CacheCategoryType;
};

export type SettingsType = {
    lang?: string;

    // messages
    messagesLimit: number;
    messageSaveCount?: number;
    messageSaveTime?: number;

    // auto upload files
    autoUpload?: boolean;
    autoUploadMusic?: number;
    autoUploadImage?: number;
    autoUploadFiles?: number;
    autoUploadVideo?: number;
    autoUploadVoice?: number;

    // cache
    cache?: boolean;
    cacheMusicTime?: number;
    cacheImageTime?: number;
    cacheFilesTime?: number;
    cacheVideoTime?: number;
    cacheVoiceTime?: number;
    cacheTotalMemory?: number;

    // auth
    isCheckVerified?: boolean;
    verificationKey?: string;
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
    cacheMemory?: number;
    totalMemory?: number;
    indexedDBMemory?: number;

    isStandalone: boolean;
    isIos?: boolean;
    logs?: string[];
    isPhone?: boolean;
    systemChatId?: string;
    isOpenMobileKeyboard?: boolean;

    batteryLevel?: number;
    batteryCharging?: boolean;
    batterySaverMode?: boolean;

    categories?: Categories;
    files?: Types[];

    RASKeys?: CryptoKeyPair;

    settings?: SettingsType;
};
