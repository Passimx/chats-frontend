import { MessageTypeEnum } from './message-type.enum.ts';

export type OpenChatType = {
    id: string;
    chatId: number;
    message: string;
    number: number;
    parentMessageId: number;
    type: MessageTypeEnum;
    createdAt: Date;
};

export type EncryptChatType = {
    id: string;
    chatId: number;
    encryptMessage: string;
    number: number;
    parentMessageId: number;
    type: MessageTypeEnum;
    createdAt: Date;
};
