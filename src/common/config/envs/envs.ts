import json from '../../../../package.json';
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
    catchLogs?: boolean;
    settings?: Partial<SettingsType>;
};

export const Envs: EnvsType = {
    chatsServiceUrl: import.meta.env.VITE_CHATS_SERVICE_URL,
    notificationsServiceUrl: import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL,
    filesServiceUrl: import.meta.env.VITE_FILES_SERVICE_URL,
    intervalPing: 4 * 1000,
    waitPong: 4 * 1000,
    salt: import.meta.env.VITE_SALT,
    environment: import.meta.env.VITE_ENVIRONMENT,
    chats: {
        limit: 250,
    },
    catchLogs: Boolean(import.meta.env.VITE_CATCH_LOGS ?? true),
    cache: {
        files: 'files-cache-name',
        static: `static-v-${json.version}`,
    },
};
