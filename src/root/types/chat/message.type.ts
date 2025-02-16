import { MessageTypeEnum } from './message-type.enum.ts';

export type MessageType = {
    id: string;
    chatId: string;
    message: string;
    number: number;
    parentMessageId: string;
    type: MessageTypeEnum;
    createdAt: Date;
};

export type EncryptMessageType = {
    id: string;
    chatId: string;
    encryptMessage: string;
    number: number;
    parentMessageId: number;
    type: MessageTypeEnum;
    createdAt: Date;
};
