import { ChatEnum } from './chat.enum.ts';

type ChatItemType = {
    id: string;
    title: string;
    type: ChatEnum.IS_OPEN;
    createdAt: Date;
    countMessages: number;
    messages: [];
    // createdUserId: string;
    // lastMessage: MessageType | null;
    // countIsNotReadMessages: number;
};

type EncryptChatItemType = {
    id: string;
    title: string;
    type: ChatEnum.IS_PRIVATE;
    countMessages: number;
    createdAt: Date;
    // encryptAesKey: string;
    // lastMessage: null | EncryptMessageType;
    // countIsNotReadMessages: number;
};
export type ChatType = ChatItemType | EncryptChatItemType;
