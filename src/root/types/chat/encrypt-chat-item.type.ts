import { EncryptMessageType } from './encrypt-message.type.ts';
import { ChatEnum } from './chat.enum.ts';

export type EncryptChatItemType = {
    id: string;
    title: string;
    sort: ChatEnum;
    encryptAesKey: string;
    lastMessage: null | EncryptMessageType;
    countIsNotReadMessages: number;
};
