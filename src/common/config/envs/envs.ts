import { SettingsType } from '../../../root/store/app/types/state.type.ts';
import json from '../../../../package.json';

export enum EnvironmentEnum {
    STAGING = 'staging',
    PRODUCTION = 'production',
}

type EnvsType = {
    userId?: string;
    chatsServiceUrl: string;
    notificationsServiceUrl: string;
    filesServiceUrl: string;
    mediaCallsServiceUrl: string;
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

    RSAKeys?: CryptoKeyPair;

    version: string;
};

export const Envs: EnvsType = {
    chatsServiceUrl: import.meta.env.VITE_CHATS_SERVICE_URL ?? `https://${import.meta.env.VITE_API_URL}/api`,
    notificationsServiceUrl:
        import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL ?? `wss://${import.meta.env.VITE_API_URL}/api/notifications`,
    filesServiceUrl: import.meta.env.VITE_FILES_SERVICE_URL ?? `https://${import.meta.env.VITE_API_URL}/api/files`,
    mediaCallsServiceUrl:
        import.meta.env.VITE_MEDIA_CALLS_SERVICE_URL ?? `https://${import.meta.env.VITE_API_URL}/api/media`,
    intervalPing: 4 * 1000,
    waitPong: 4 * 1000,
    appSalt: 'sha256',
    environment: import.meta.env.VITE_ENVIRONMENT,
    chats: {
        limit: 250,
    },
    cache: {
        files: 'files-cache',
        static: 'static-files',
    },

    version: import.meta.env.VITE_APP_VERSION ?? json.version,
};
