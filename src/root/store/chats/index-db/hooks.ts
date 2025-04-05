import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import rawChats, { getRawChat } from '../chats.raw.ts';
import { rawApp } from '../../app/app.raw.ts';

export const upsertChatIndexDb = (chat: ChatItemIndexDb) =>
    new Promise<void>((resolve) => {
        const IndexDb = rawChats.indexDb;
        if (!IndexDb) return;

        // только главная вкладка может делать операции с IndexDb
        if (!rawApp.isMainTab) return;

        const payload = Object.assign({}, chat);
        delete payload.online;

        const chatIsAdded = !!getRawChat(payload.id);
        const dateNow = new Date(chatIsAdded ? payload.message.createdAt : Date.now()).getTime();

        const request1 = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').get(payload.id);

        request1.onsuccess = () => {
            if (request1.result) IndexDb.transaction('chats', 'readwrite').objectStore('chats').delete(request1.result);

            IndexDb.transaction('chats', 'readwrite').objectStore('chats').add(payload, dateNow);
            IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').delete(payload.id).onsuccess =
                () => {
                    IndexDb.transaction('chats-keys', 'readwrite')
                        .objectStore('chats-keys')
                        .add(dateNow, payload.id).onsuccess = () => resolve();
                };
        };
    });

export const deleteChatIndexDb = (id: string) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    // только главная вкладка может делать операции с IndexDb
    if (!rawApp.isMainTab) return;

    const chatsKeys = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys');
    const request = chatsKeys.get(id);

    request.onsuccess = () => {
        if (!request.result) return;

        IndexDb.transaction('chats', 'readwrite').objectStore('chats').delete(request.result);
        IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').delete(id);
    };
};

export const updateChatIndexDb = (chat: ChatItemIndexDb) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    // только главная вкладка может делать операции с IndexDb
    if (!rawApp.isMainTab) return;

    const payload = Object.assign({}, chat);
    delete payload.online;

    const request = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').get(payload.id);

    request.onsuccess = () => {
        if (request.result) IndexDb.transaction('chats', 'readwrite').objectStore('chats').put(payload, request.result);
    };
};
