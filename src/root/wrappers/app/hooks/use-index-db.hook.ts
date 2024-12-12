import { useEffect } from 'react';
import { useAppAction } from '../../../store';
import rawChats from '../../../store/chats/chats.raw.ts';

// window.indexedDB.databases().then((r) => {
//     for (let i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
// });

export const useIndexDbHook = () => {
    const { setToEnd } = useAppAction();

    useEffect(() => {
        const openRequest = indexedDB.open('store', 1);
        openRequest.onsuccess = () => {
            const IndexDb = openRequest.result;
            rawChats.indexDb = IndexDb;

            const request = IndexDb.transaction('chats', 'readonly').objectStore('chats').getAll();
            request.onsuccess = () => {
                setToEnd([...request.result].reverse());
            };
        };

        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('chats')) db.createObjectStore('chats');
            if (!db.objectStoreNames.contains('chats-keys')) db.createObjectStore('chats-keys');
        };
    }, []);
};
