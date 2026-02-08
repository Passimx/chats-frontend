import { JSX } from 'react';
import { Types } from '../../../types/files/types.ts';

export enum TabEnum {
    AUTHORIZATION = 'authorization',
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

export type KeyInfImageType = {
    original: Types;
    small: Types;
};

export type KeyInfMetadataType = {
    name: string;
    images?: KeyInfImageType[];
};

export type KeyInfType = {
    name: string;
    metadata: KeyInfMetadataType;
    publicKeyHash: string;
    publicKey: string;
    privateKey: string;

    RASKeys?: CryptoKeyPair;
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

    // appearance
    zoom?: number;

    // auth
    isCheckVerified?: boolean;
    verificationKey?: string;
};

export type StateType = {
    isOnline: boolean;
    isActiveTab?: boolean;
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
    systemChatName?: string;
    favoritesChatName?: string;
    isOpenMobileKeyboard?: boolean;

    batteryLevel?: number;
    batteryCharging?: boolean;
    batterySaverMode?: boolean;

    categories?: Categories;
    files?: Types[];

    settings?: SettingsType;

    //Входящий звонок: roomId и initiatorId для кнопки «Присоединиться»
    incomingCall?: { roomId: string; initiatorId: string } | null;
};
