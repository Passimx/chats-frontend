import { SettingsType } from '../../../root/store/app/types/state.type.ts';

export enum EnvironmentEnum {
    STAGING = 'staging',
    PRODUCTION = 'production',
}

type EnvsType = {
    socketId?: string;
    allowUrls?: string[];
    chatsServiceUrl: string;
    notificationsServiceUrl: string;
    filesServiceUrl: string;
    intervalPing: number;
    waitPong: number;
    environment: EnvironmentEnum;
    appSalt: string;
    chats: {
        limit: number;
    };
    cache: {
        files: string;
        static: string;
    };
    settings?: Partial<SettingsType>;

    RASKeys?: CryptoKeyPair;
};

const allowUrls: string[] = ['fonts.googleapis.com', window.location.host];

if (import.meta.env.VITE_ALLOW_URLS?.length > 0) {
    const array: string[] = import.meta.env.VITE_ALLOW_URLS.split(',');
    array?.forEach((url: string) => allowUrls.push(url));
}

export const Envs: EnvsType = {
    allowUrls,
    chatsServiceUrl: import.meta.env.VITE_CHATS_SERVICE_URL ?? `https://${import.meta.env.VITE_API_URL}/api`,
    notificationsServiceUrl:
        import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL ?? `wss://${import.meta.env.VITE_API_URL}/api/notifications`,
    filesServiceUrl: import.meta.env.VITE_FILES_SERVICE_URL ?? `https://${import.meta.env.VITE_API_URL}/api/files`,
    intervalPing: 4 * 1000,
    waitPong: 4 * 1000,
    appSalt: import.meta.env.VITE_SALT || 'sha256',
    environment: import.meta.env.VITE_ENVIRONMENT,
    chats: {
        limit: 250,
    },
    cache: {
        files: 'files-cache',
        static: 'static-files',
    },
};
