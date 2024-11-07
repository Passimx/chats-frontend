import { ChatEnum } from './chat.enum.ts';

export type ChatItemType = {
    id: string;
    title: string;
    createdAt: Date;
    countMessages: number;
    type: ChatEnum;
    // createdUserId: string;
    // lastMessage: MessageType | null;
    // countIsNotReadMessages: number;
};
