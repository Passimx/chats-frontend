import { ChatType } from '../../types/chat/chat.type.ts';
import { RawChatType } from './types/raw-chat.type.ts';

const rawChats: RawChatType = {
    chats: new Map<string, ChatType>(),
    updatedChats: new Map<string, ChatType>(),
    chatsRead: new Map<string, number>(),
    indexDb: undefined,
};

export default rawChats;
