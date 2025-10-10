import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import rawChats from '../chats.raw.ts';
import { rawApp } from '../../app/app.raw.ts';

export const upsertChatIndexDb = (payload: ChatItemIndexDb, oldKey?: number) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb || !rawApp.isMainTab) return; // Проверки в начале

    const chat = { ...payload };
    delete chat.online;

    const tx = IndexDb.transaction(['chats'], 'readwrite'); // Единая транзакция
    const chatsStore = tx.objectStore('chats');

    if (oldKey) chatsStore.delete(oldKey);
    chatsStore.put(chat, chat.key);
};

export const deleteChatIndexDb = (chat: ChatItemIndexDb) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    // только главная вкладка может делать операции с IndexDb
    if (!rawApp.isMainTab) return;

    IndexDb.transaction('chats', 'readwrite').objectStore('chats').delete(chat.key);
};

export const updateChatIndexDb = (payload: ChatItemIndexDb) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    if (!rawApp.isMainTab) return;

    const chat = { ...payload };
    delete chat.online;

    IndexDb.transaction(['chats'], 'readwrite').objectStore('chats').put(chat, chat.key);
};
