type EnvsType = {
    socketId?: string;
    chatsServiceUrl: string;
    notificationsServiceUrl: string;
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
    salt: import.meta.env.VITE_SALT,
    chats: {
        limit: 250,
    },
    messages: {
        limit: 20,
    },
};
