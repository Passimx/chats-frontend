import { ChatEnum } from './chat.enum.ts';
import { MessageType } from './message.type.ts';

export type ChatItemType = {
    id: string;
    title: string;
    lastMessage: MessageType | null;
    sort: ChatEnum;
    countIsNotReadMessages: number;
};
