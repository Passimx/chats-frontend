import { useEffect } from 'react';
import { useAppAction } from '../../../store';
import rawChats from '../../../store/chats/chats.raw.ts';

export const useIndexDbHook = () => {
    const { setToEnd, updateReadChat, setIsLoadedChatsFromIndexDb } = useAppAction();

    useEffect(() => {
        const openRequest = indexedDB.open('store', 1);
        openRequest.onsuccess = () => {
            const IndexDb = openRequest.result;
            rawChats.indexDb = IndexDb;

            const request = IndexDb.transaction('chats', 'readonly').objectStore('chats').getAll();
            request.onsuccess = () => {
                setToEnd([...request.result].reverse());

                const request2 = IndexDb.transaction('chats-read', 'readonly').objectStore('chats-read').getAllKeys();
                request2.onsuccess = () => {
                    const request3 = IndexDb.transaction('chats-read', 'readonly').objectStore('chats-read').getAll();
                    request3.onsuccess = () => {
                        request2.result.forEach((key, index) =>
                            updateReadChat({ chatId: key as string, number: request3.result[index] }),
                        );
                        setIsLoadedChatsFromIndexDb(true);
                    };
                };
            };
        };

        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('chats')) db.createObjectStore('chats');
            if (!db.objectStoreNames.contains('chats-keys')) db.createObjectStore('chats-keys');
            if (!db.objectStoreNames.contains('chats-read')) db.createObjectStore('chats-read');
            if (!db.objectStoreNames.contains('messages')) db.createObjectStore('messages');
        };
    }, []);
};
