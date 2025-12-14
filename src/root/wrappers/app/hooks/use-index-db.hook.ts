import { useEffect } from 'react';
import { useAppAction } from '../../../store';
import rawChats from '../../../store/raw/chats.raw.ts';
import { ChatEnum } from '../../../types/chat/chat.enum.ts';
import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import { CryptoService } from '../../../../common/services/crypto.service.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { UserIndexDbType } from '../../../types/users/user-index-db.type.ts';

export const useIndexDbHook = () => {
    const { setToEnd, setStateApp, setStateChat, setStateUser } = useAppAction();

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

                    return chat;
                });

                const chats = await Promise.all(tasks);
                setToEnd(chats.reverse());
                if (messageCount) setStateChat({ messageCount });

                if (systemChat) setStateApp({ systemChatName: systemChat.name });
                if (favoritesChat) setStateApp({ favoritesChatName: favoritesChat.name });

                const requestAccounts = IndexDb.transaction('accounts', 'readonly').objectStore('accounts').getAll();
                requestAccounts.onsuccess = async () => {
                    const account = requestAccounts.result.reverse()[0] as UserIndexDbType;
                    if (!account) return setStateApp({ isLoadedChatsFromIndexDb: true });

                    const rsaPrivateKeyString = await CryptoService.decryptByAESKey(
                        account.aesKey,
                        account.encryptedRsaPrivateKey,
                    );
                    if (!rsaPrivateKeyString) return setStateApp({ isLoadedChatsFromIndexDb: true });
                    const rsaPrivateKey = await CryptoService.importRSAKey(rsaPrivateKeyString, ['decrypt']);
                    if (!rsaPrivateKey) return setStateApp({ isLoadedChatsFromIndexDb: true });

                    Envs.RASKeys = { publicKey: account.rsaPublicKey, privateKey: rsaPrivateKey };
                    setStateUser({ ...account, rsaPrivateKey });
                    setStateApp({ isLoadedChatsFromIndexDb: true });
                };
            };
        };

        openRequest.onupgradeneeded = () => {
            const db = openRequest.result;
            if (!db.objectStoreNames.contains('chats')) db.createObjectStore('chats');
            if (!db.objectStoreNames.contains('accounts')) db.createObjectStore('accounts');
        };
    }, []);
};
