import { MessageTypeEnum } from './message-type.enum.ts';
import { Types } from '../files/types.ts';

export type MessageFromServerType = {
    id: string;
    chatId: string;
    message: string;
    number: number;
    parentMessageId: string;
    type: MessageTypeEnum;
    createdAt: Date;
    parentMessage?: MessageType;
    files: Types[];
};

type SaveTimeMessageType = {
    saveAt: number;
};

export type MessageType = MessageFromServerType & SaveTimeMessageType;
