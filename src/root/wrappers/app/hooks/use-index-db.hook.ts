import { useEffect } from 'react';
import { useAppAction } from '../../../store';
import rawChats, { setRawCryptoKey } from '../../../store/raw/chats.raw.ts';
import { ChatEnum } from '../../../types/chat/chat.enum.ts';
import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import { CryptoService } from '../../../../common/services/crypto.service.ts';

export const useIndexDbHook = () => {
    const { setToEnd, setStateApp, setStateChat } = useAppAction();

    useEffect(() => {
        const openRequest = indexedDB?.open('store', 1);
        if (!openRequest) return;
        openRequest.onsuccess = () => {
            const IndexDb = openRequest.result;
            rawChats.indexDb = IndexDb;

            const request = IndexDb.transaction('chats', 'readonly').objectStore('chats').getAll();
            request.onsuccess = async () => {
                let systemChat: ChatItemIndexDb | undefined;
                let favoritesChat: ChatItemIndexDb | undefined;
                let messageCount = 0;

                const tasks = request.result.map(async (chat: ChatItemIndexDb) => {
                    messageCount += chat.countMessages - chat.readMessage;
                    if (chat.type === ChatEnum.IS_SYSTEM) systemChat = chat;
                    if (chat.type === ChatEnum.IS_FAVORITES) favoritesChat = chat;

                    if (chat.aesKeyString) {
                        const aesKey = await CryptoService.importEASKey(chat.aesKeyString);
                        setRawCryptoKey(chat.id, aesKey);
                    }

                    return chat;
                });

                const chats = await Promise.all(tasks);
                setToEnd(chats.reverse());
                if (messageCount) setStateChat({ messageCount });

                if (systemChat) setStateApp({ systemChatName: systemChat.name });
                if (favoritesChat) setStateApp({ favoritesChatName: favoritesChat.name });

                setStateApp({ isLoadedChatsFromIndexDb: true });
            };
        };

        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('chats')) db.createObjectStore('chats');
        };
    }, []);
};
