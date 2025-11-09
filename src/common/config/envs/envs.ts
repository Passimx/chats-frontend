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
};

export const Envs: EnvsType = {
    chatsServiceUrl: `https://${import.meta.env.VITE_API_URL}/api`,
    notificationsServiceUrl: `wss://${import.meta.env.VITE_API_URL}/api/notifications`,
    filesServiceUrl: `https://${import.meta.env.VITE_API_URL}/api/files`,
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
