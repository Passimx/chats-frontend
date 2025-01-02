import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';

export type PropsType = {
    chatId: string;
    message: string;
    createdAt: Date;
    type: MessageTypeEnum;
    title: string;
    number: number;
    readMessage: (number: number) => unknown;
};
