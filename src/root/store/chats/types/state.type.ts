import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';

export type StateType = {
    chats: ChatItemIndexDb[];
    updatedChats: ChatItemIndexDb[];
    chatOnPage?: ChatItemIndexDb;
    messageCount?: string;
};
