import { useEffect } from 'react';
import { useAppAction } from '../../../store';
import rawChats from '../../../store/chats/chats.raw.ts';
import { ChatEnum } from '../../../types/chat/chat.enum.ts';
import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';

export const useIndexDbHook = () => {
    const { setToEnd, setStateApp, setStateChat } = useAppAction();

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

                let systemChat: ChatItemIndexDb | undefined;
                let messageCount = 0;

                request.result.forEach((chat) => {
                    messageCount += chat.countMessages - chat.readMessage;
                    if (chat.type === ChatEnum.IS_SYSTEM) systemChat = chat;
                });

                if (messageCount) setStateChat({ messageCount });

                if (systemChat) setStateApp({ systemChatId: systemChat.id });
                else setStateApp({ systemChatId: undefined });
            };
        };

        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('chats')) db.createObjectStore('chats');
            if (!db.objectStoreNames.contains('chats-keys')) db.createObjectStore('chats-keys');
        };
    }, []);
};
