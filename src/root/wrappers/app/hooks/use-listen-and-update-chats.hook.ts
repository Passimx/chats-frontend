import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { listenChats } from '../../../api/chats';
import { ChatListenRequestType } from '../../../types/chat/chat-listen-request.type.ts';
import rawChats from '../../../store/chats/chats.raw.ts';
import { updateChatAtIndexDb } from '../../../store/chats/index-db/hooks.ts';

export const useListenAndUpdateChats = () => {
    const { setIsListening, setToBegin } = useAppAction();
    const { socketId, isLoadedChatsFromIndexDb, isListening } = useAppSelector((state) => state.app);

    useEffect(() => {
        if (!socketId) setIsListening(false);
        if (!socketId || !isLoadedChatsFromIndexDb || isListening) return;
        if (!rawChats.chats.size) return;

        const chatsListen: ChatListenRequestType[] = [];
        rawChats.chats.forEach((chat, chatId) => chatsListen.push({ chatId, lastMessage: chat.message.number }));

        listenChats(chatsListen)
            .then(async ({ success, data }) => {
                const indexDb = rawChats.indexDb;
                if (!indexDb) return;
                if (!success) return;
                if (!data.length) return;
                await Promise.all(
                    data.map((chat) => {
                        const chatFromRaw = rawChats.chats.get(chat.id);
                        if (!chatFromRaw) return;
                        return updateChatAtIndexDb({ ...chatFromRaw, ...chat });
                    }),
                );

                const request = indexDb.transaction('chats', 'readonly').objectStore('chats').getAll();

                request.onsuccess = () => {
                    request.result.forEach((c) => setToBegin(c));
                };
            })
            .catch(() => setIsListening(false));
    }, [socketId, isLoadedChatsFromIndexDb]);
};
