import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import rawChats, { getRawChat } from '../chats.raw.ts';
import { rawApp } from '../../app/app.raw.ts';

export const upsertChatIndexDb = (chat: ChatItemIndexDb) =>
    new Promise<void>((resolve, reject) => {
        const IndexDb = rawChats.indexDb;
        if (!IndexDb || !rawApp.isMainTab) return resolve(); // Проверки в начале

        const payload = { ...chat };
        delete payload.online;

        const isChatAdded = !!getRawChat(payload.id);
        const dateNow = new Date(isChatAdded ? payload.message.createdAt : Date.now()).getTime();

        const tx = IndexDb.transaction(['chats', 'chats-keys'], 'readwrite'); // Единая транзакция
        const chatsStore = tx.objectStore('chats');
        const keysStore = tx.objectStore('chats-keys');

        // Получаем текущий ключ из chats-keys
        const getKeyRequest = keysStore.get(payload.id);

        getKeyRequest.onsuccess = () => {
            const oldKey = getKeyRequest.result;

            // Удаляем старую запись в chats, если ключ существует
            if (oldKey) {
                const deleteRequest = chatsStore.delete(oldKey);
                deleteRequest.onerror = (e) => reject(e);
            }

            // Добавляем/обновляем запись в chats с новым ключом (dateNow)
            const addRequest = chatsStore.add(payload, dateNow);

            addRequest.onsuccess = () => {
                keysStore.delete(payload.id).onsuccess = () => {
                    keysStore.add(dateNow, payload.id).onsuccess = () => resolve();
                };
            };
            addRequest.onerror = (e) => reject(e);
        };

        getKeyRequest.onerror = (e) => {
            console.error('Ошибка получения ключа:', e);
            reject(e);
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
