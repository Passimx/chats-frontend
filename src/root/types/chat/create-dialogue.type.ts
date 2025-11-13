export type DialogueKey = { publicKeyHash: string; encryptionKey: string };

export type BodyCreateDialogueType = {
    keys: DialogueKey[];
};
