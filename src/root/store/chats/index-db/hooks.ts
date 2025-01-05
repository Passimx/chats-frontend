import { ChatType } from '../../../types/chat/chat.type.ts';
import rawChats from '../chats.raw.ts';
import { MessageType } from '../../../types/chat/message.type.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';

const addMessageToIndexDb = (message: MessageType) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    const chatId = message.chatId;

    const request = IndexDb.transaction('messages', 'readwrite').objectStore('messages').get(chatId);
    request.onsuccess = () => {
        const messages = [message, ...(request.result?.slice(0, Envs.messages.limit) ?? [])];
        IndexDb.transaction('messages', 'readwrite').objectStore('messages').delete(chatId);
        IndexDb.transaction('messages', 'readwrite').objectStore('messages').add(messages, chatId);
    };
};

export const updateChatAtIndexDb = (payload: ChatType) => {
    const IndexDb = rawChats.indexDb;

    if (!IndexDb) return;
    addMessageToIndexDb(payload.message);
    const dateNow = new Date(payload.message.createdAt).getTime();
    const chatsKeys = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys');

    const request = chatsKeys.get(payload.id);

    request.onsuccess = () => {
        if (request.result) IndexDb.transaction('chats', 'readwrite').objectStore('chats').delete(request.result);
        IndexDb.transaction('chats', 'readwrite').objectStore('chats').add(payload, dateNow);
        IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').delete(payload.id).onsuccess = () =>
            IndexDb?.transaction('chats-keys', 'readwrite').objectStore('chats-keys').add(dateNow, payload.id);
    };
};

export const deleteChatIndexDb = (id: string) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    const chatsKeys = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys');
    const request = chatsKeys.get(id);

    request.onsuccess = () => {
        if (request.result) IndexDb.transaction('chats', 'readwrite').objectStore('chats').delete(request.result);
        IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').delete(id);
        IndexDb.transaction('chats-read', 'readwrite').objectStore('chats-read').delete(id);
    };
};

export const updateReadChat = (chatId: string, number: number) => {
    const IndexDb = rawChats.indexDb;
    rawChats.chatsRead.set(chatId, number);
    if (!IndexDb) return;

    IndexDb.transaction('chats-read', 'readwrite').objectStore('chats-read').delete(chatId);
    IndexDb.transaction('chats-read', 'readwrite').objectStore('chats-read').add(number, chatId);
};

export const saveMessages = (chatId: string, payload: MessageType[]) => {
    const IndexDb = rawChats.indexDb;
    if (!IndexDb) return;

    const messages = payload.slice(0, Envs.messages.limit);

    IndexDb.transaction('messages', 'readwrite').objectStore('messages').delete(chatId);
    IndexDb.transaction('messages', 'readwrite').objectStore('messages').add(messages, chatId);
};

export const getMessagesFromIndexDb = (chatId: string): Promise<MessageType[]> =>
    new Promise((resolve) => {
        const IndexDb = rawChats.indexDb;
        if (!IndexDb) return resolve([]);

        const request = IndexDb.transaction('messages', 'readwrite').objectStore('messages').get(chatId);
        request.onsuccess = () => resolve(request.result?.length ? request.result : []);
        request.onerror = () => resolve([]);
    });
