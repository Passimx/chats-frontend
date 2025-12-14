export type CreateChatKeyType = { userId: string; encryptionKey: string };

export type BodyCreateDialogueType = {
    keys: CreateChatKeyType[];
};
