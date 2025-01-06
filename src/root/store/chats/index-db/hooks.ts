import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import rawChats from '../chats.raw.ts';

export const updateChatAtIndexDb = (payload: ChatItemIndexDb) =>
    new Promise<void>((resolve) => {
        const IndexDb = rawChats.indexDb;

        if (!IndexDb) return;
        const dateNow = new Date(payload.message.createdAt).getTime();
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
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    const request = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').get(chat.id);

    request.onsuccess = () => {
        if (!request.result) return;

        const dateNow = new Date(chat.message.createdAt).getTime();

        IndexDb.transaction('chats', 'readwrite').objectStore('chats').delete(request.result);
        IndexDb.transaction('chats', 'readwrite').objectStore('chats').add(chat, dateNow);
    };
};
