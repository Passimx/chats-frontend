import { SettingsType } from '../../../root/store/app/types/state.type.ts';

export enum EnvironmentEnum {
    STAGING = 'staging',
    PRODUCTION = 'production',
}

type EnvsType = {
    socketId?: string;
    chatsServiceUrl: string;
    notificationsServiceUrl: string;
    filesServiceUrl: string;
    intervalPing: number;
    waitPong: number;
    environment: EnvironmentEnum;
    salt: string;
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

export const Envs: EnvsType = {
    chatsServiceUrl: import.meta.env.VITE_CHATS_SERVICE_URL ?? `https://${import.meta.env.VITE_API_URL}/api`,
    notificationsServiceUrl:
        import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL ?? `wss://${import.meta.env.VITE_API_URL}/api/notifications`,
    filesServiceUrl: import.meta.env.VITE_FILES_SERVICE_URL ?? `https://${import.meta.env.VITE_API_URL}/api/files`,
    intervalPing: 4 * 1000,
    waitPong: 4 * 1000,
    salt: import.meta.env.VITE_SALT,
    environment: import.meta.env.VITE_ENVIRONMENT,
    chats: {
        limit: 250,
    },
    cache: {
        files: 'files-cache-name',
        static: 'static-files',
    },
};
