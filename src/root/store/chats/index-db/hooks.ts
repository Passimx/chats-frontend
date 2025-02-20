import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import rawChats from '../chats.raw.ts';

export const updateChatAtIndexDb = (chat: ChatItemIndexDb) =>
    new Promise<void>((resolve) => {
        const payload = Object.assign({}, chat);
        delete payload.online;
        const IndexDb = rawChats.indexDb;

        if (!IndexDb) return;

        // добавленный чат должен быть в верху списка чатов
        const chatIsAdded = !!(rawChats.chats.get(payload.id) ?? rawChats.updatedChats.get(payload.id));
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

    const chatsKeys = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys');
    const request = chatsKeys.get(id);

    request.onsuccess = () => {
        if (!request.result) return;

        IndexDb.transaction('chats', 'readwrite').objectStore('chats').delete(request.result);
        IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').delete(id);
    };
};

export const updateReadChat = (chat: ChatItemIndexDb) => {
    const payload = Object.assign({}, chat);
    delete payload.online;

    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    const request = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').get(payload.id);

    request.onsuccess = () => {
        if (request.result) IndexDb.transaction('chats', 'readwrite').objectStore('chats').put(payload, request.result);
    };
};
