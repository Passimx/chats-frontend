import { ChatType } from '../../../types/chat/chat.type.ts';

export type RawChatType = {
    chats: Map<string, ChatType>;
    updatedChats: Map<string, ChatType>;
    chatsRead: Map<string, number>;
    indexDb: IDBDatabase | undefined;
};
