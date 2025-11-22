import { useAppAction, useAppSelector } from '../../../store';
import { useEffect, useState } from 'react';
import { createDialogue, getSystemChat, listenChats } from '../../../api/chats';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { rawApp } from '../../../store/app/app.raw.ts';
import { CryptoService } from '../../../../common/services/crypto.service.ts';
import { DialogueKey } from '../../../types/chat/create-dialogue.type.ts';

export const useRequiredChats = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { postMessageToBroadCastChannel } = useAppAction();
    const { systemChatId, favoritesChatId, isLoadedChatsFromIndexDb, isListening, socketId, keyInf } = useAppSelector(
        (state) => state.app,
    );

    const setSystemChat = async () => {
        const response = await getSystemChat();

        if (response.success) {
            if (!response.data.length) return;
            const [chat] = response.data;

            postMessageToBroadCastChannel({
                event: EventsEnum.ADD_CHAT,
                data: { ...chat, readMessage: 0, messages: [chat.message], scrollTop: 0, key: Date.now() },
            });
            listenChats([
                { chatId: chat?.id, lastMessage: chat?.countMessages, maxUsersOnline: Number(chat?.maxUsersOnline) },
            ]);
        }
    };

    const setFavoritesChat = async () => {
        if (!socketId || !keyInf?.RASKeys?.publicKey) return;
        const aesKeyString = await CryptoService.generateAndExportAesKey();
        const encryptionKey = await CryptoService.encryptByRSAKey(keyInf?.RASKeys?.publicKey, aesKeyString);
        if (!encryptionKey) return;

        const keys: DialogueKey[] = [];
        keys.push({ publicKeyHash: socketId, encryptionKey });

        await createDialogue({ keys });
    };

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb || !isListening || !rawApp.isMainTab || isLoaded) return;
        setIsLoaded(true);

        if (!systemChatId) setSystemChat();
        if (!favoritesChatId) setFavoritesChat();
    }, [systemChatId, isLoadedChatsFromIndexDb, isListening, isLoaded]);
};
