import { EncryptMessageType } from './encrypt-message.type.ts';
import { ChatEnum } from './chat.enum.ts';

export type EncryptChatItemType = {
    id: string;
    title: string;
    encryptAesKey: string;
    lastMessage: null | EncryptMessageType;
    sort: ChatEnum;
    countIsNotReadMessages: number;
};
