import { ChatItemIndexDb, ChatType } from '../../../types/chat/chat.type.ts';
import { ChatUpdateOnline } from '../../../types/chat/chat-update-online.type.ts';

export type StateType = {
    chats: ChatItemIndexDb[];
    chatsOnline: ChatUpdateOnline[];
    updatedChats: ChatItemIndexDb[];
    chatOnPage?: ChatType;
};
