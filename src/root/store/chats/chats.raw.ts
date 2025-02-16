import { ChatItemIndexDb } from '../../types/chat/chat.type.ts';
import { RawChatType } from './types/raw-chat.type.ts';

const rawChats: RawChatType = {
    chats: new Map<string, ChatItemIndexDb>(),
    updatedChats: new Map<string, ChatItemIndexDb>(),
    indexDb: undefined,
};

export default rawChats;
