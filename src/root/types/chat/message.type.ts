import { MessageTypeEnum } from './message-type.enum.ts';
import { Types } from '../files/types.ts';
import { ChatType } from './chat.type.ts';

interface User {
    id: string;
    name: string;
    userName: string;
    createdAt: string; // или Date, если преобразуете
}

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
    chat?: Partial<ChatType>;
    user: User;
};

type SaveTimeMessageType = {
    saveAt: number;
};

export type MessageType = MessageFromServerType & SaveTimeMessageType;
