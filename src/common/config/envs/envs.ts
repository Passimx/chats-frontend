import json from '../../../../package.json';

type EnvsType = {
    socketId?: string;
    chatsServiceUrl: string;
    notificationsServiceUrl: string;
    filesServiceUrl: string;
    intervalPing: number;
    waitPong: number;
    salt: string;
    chats: {
        limit: number;
    };
    messages: {
        limit: number;
    };
    cache: {
        files: string;
        static: string;
    };
};

export const Envs: EnvsType = {
    chatsServiceUrl: import.meta.env.VITE_CHATS_SERVICE_URL,
    notificationsServiceUrl: import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL,
    filesServiceUrl: import.meta.env.VITE_FILES_SERVICE_URL,
    intervalPing: 4 * 1000,
    waitPong: 4 * 1000,
    salt: import.meta.env.VITE_SALT,
    chats: {
        limit: 250,
    },
    messages: {
        limit: 250,
    },
    cache: {
        files: 'files-cache-name',
        static: `static-v-${json.version}`,
    },
};
