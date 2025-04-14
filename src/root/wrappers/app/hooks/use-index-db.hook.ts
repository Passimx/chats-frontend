import { useEffect } from 'react';
import { useAppAction } from '../../../store';
import rawChats from '../../../store/chats/chats.raw.ts';
import { ChatEnum } from '../../../types/chat/chat.enum.ts';

export const useIndexDbHook = () => {
    const { setToEnd, setStateApp } = useAppAction();

    useEffect(() => {
        const openRequest = indexedDB?.open('store', 1);
        if (!openRequest) return;
        openRequest.onsuccess = () => {
            const IndexDb = openRequest.result;
            rawChats.indexDb = IndexDb;

            const request = IndexDb.transaction('chats', 'readonly').objectStore('chats').getAll();
            request.onsuccess = () => {
                setToEnd([...request.result].reverse());
                setStateApp({ isLoadedChatsFromIndexDb: true });

                const systemChat = request.result.find((chat) => chat.type === ChatEnum.IS_SYSTEM);
                if (systemChat) setStateApp({ isSystemChat: true });
                else setStateApp({ isSystemChat: false });
            };
        };

        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('chats')) db.createObjectStore('chats');
            if (!db.objectStoreNames.contains('chats-keys')) db.createObjectStore('chats-keys');
        };
    }, []);
};
