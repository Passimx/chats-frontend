import { ChatItemIndexDb, ChatType } from '../../../types/chat/chat.type.ts';

export type StateType = {
    chats: ChatItemIndexDb[];
    updatedChats: ChatItemIndexDb[];
    chatOnPage?: ChatType & Partial<ChatItemIndexDb>;
};
