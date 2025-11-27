export type CreateChatKeyType = { publicKeyHash: string; encryptionKey: string };

export type BodyCreateDialogueType = {
    keys: CreateChatKeyType[];
};
