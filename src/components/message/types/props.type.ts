import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';

export type PropsType = {
    chatId: number;
    message: string;
    createdAt: Date;
    type: MessageTypeEnum;
    title: string;
    number: number;
};
