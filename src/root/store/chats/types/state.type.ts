import { ChatType } from '../../../types/chat/chat.type.ts';
import { ChatReadType } from './chat-read.type.ts';

export type StateType = {
    chats: ChatType[];
    updatedChats: ChatType[];
    chatsRead: ChatReadType[];
    chatOnPage?: ChatType;
};
