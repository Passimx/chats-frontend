type EnvsType = {
    socketId?: string;
    chatsServiceUrl: string;
    salt: string;
    chats: {
        limit: number;
    };
};

export const Envs: EnvsType = {
    chatsServiceUrl: import.meta.env.VITE_CHATS_SERVICE_URL,
    salt: import.meta.env.VITE_SALT,
    chats: {
        limit: 250,
    },
};
