export type ChatKeyType = {
    chatId: string;
    userId: string;
    encryptionKey: string;
    received: boolean;
    isMember: boolean;
    readMessageNumber: number;
    createdAt: Date;
};
