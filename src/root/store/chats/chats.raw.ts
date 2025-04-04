import { ChatItemIndexDb } from '../../types/chat/chat.type.ts';
import { RawChatType } from './types/raw-chat.type.ts';

const rawChats: RawChatType = {
    chats: new Map<string, ChatItemIndexDb>(),
    updatedChats: new Map<string, ChatItemIndexDb>(),
    indexDb: undefined,
};

export default rawChats;

export const getRawChat = (id: string): ChatItemIndexDb | undefined => {
    return rawChats.chats.get(id) ?? rawChats.updatedChats.get(id);
};

export const updateRawChat = (chat: ChatItemIndexDb) => {
    if (rawChats.chats.get(chat.id)) rawChats.chats.set(chat.id, chat);
    if (rawChats.updatedChats.get(chat.id)) rawChats.updatedChats.set(chat.id, chat);
};

export const deleteChat = (id: string) => {
    rawChats.chats.delete(id) || rawChats.updatedChats.delete(id);
};

export const getRawChats = (): ChatItemIndexDb[] => {
    return [...rawChats.chats.values(), ...rawChats.updatedChats.values()].reverse();
};
