import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';

export type RawChatType = {
    chats: Map<string, ChatItemIndexDb>;
    updatedChats: Map<string, ChatItemIndexDb>;
    indexDb: IDBDatabase | undefined;
    keys: Map<string, CryptoKey>;
};
