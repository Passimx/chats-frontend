type EnvsType = {
    socketId?: string;
    chatsServiceUrl: string;
    notificationsServiceUrl: string;
    intervalPing: number;
    waitPong: number;
    salt: string;
    chats: {
        limit: number;
    };
    messages: {
        limit: number;
    };
};

export const Envs: EnvsType = {
    chatsServiceUrl: import.meta.env.VITE_CHATS_SERVICE_URL,
    notificationsServiceUrl: import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL,
    intervalPing: 4 * 1000,
    waitPong: 4 * 1000,
    salt: import.meta.env.VITE_SALT,
    chats: {
        limit: 250,
    },
    messages: {
        limit: 250,
    },
};
