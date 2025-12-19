import { MessageTypeEnum } from './message-type.enum.ts';
import { Types } from '../files/types.ts';
import { ChatType } from './chat.type.ts';
import { UserFromServerMe } from '../users/user-from-server-me.type.ts';

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
    user: UserFromServerMe;
};

type SaveTimeMessageType = {
    saveAt: number;
};

export type MessageType = MessageFromServerType & SaveTimeMessageType;
