import { ChatType } from '../../../types/chat/chat.type.ts';

export type RawChatType = {
    chats: Map<number, ChatType>;
    updatedChats: Map<number, ChatType>;
    indexDb: IDBDatabase | undefined;
};
