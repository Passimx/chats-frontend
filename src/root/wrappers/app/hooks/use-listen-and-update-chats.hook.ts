import { useAppAction, useAppSelector } from '../../../store';
import { useCallback, useEffect } from 'react';
import { listenChats } from '../../../api/chats';
import { ChatListenRequestType } from '../../../types/chat/chat-listen-request.type.ts';
import rawChats from '../../../store/chats/chats.raw.ts';
import { ChatItemIndexDb, ChatType } from '../../../types/chat/chat.type.ts';
import { updateChatAtIndexDb } from '../../../store/chats/index-db/hooks.ts';

export const useListenAndUpdateChats = () => {
    const { setIsListening, setToBegin } = useAppAction();
    const { socketId, isLoadedChatsFromIndexDb, isListening } = useAppSelector((state) => state.app);

    const compareFn = useCallback((chat1: ChatType, chat2: ChatType) => {
        const firstDate = new Date(chat1.message.createdAt).getTime();
        const secondDate = new Date(chat2.message.createdAt).getTime();

        if (firstDate > secondDate) return 1;
        else return -1;
    }, []);

    useEffect(() => {
        if (!socketId) setIsListening(false);
        if (!socketId || !isLoadedChatsFromIndexDb || isListening) return;
        if (!rawChats.chats.size) {
            setIsListening(true);
            return;
        }

        const chatsListen: ChatListenRequestType[] = [];
        rawChats.chats.forEach((chat, chatId) => chatsListen.push({ chatId, lastMessage: chat.countMessages }));

        listenChats(chatsListen)
            .then(({ success, data }) => {
                const indexDb = rawChats.indexDb;
                if (!indexDb) return;
                if (!success) return;

                data.sort(compareFn).map((chat) => {
                    const chatFromRaw = rawChats.chats.get(chat.id);
                    if (!chatFromRaw) return;
                    const updatedChat: ChatItemIndexDb = { ...chatFromRaw, ...chat };

                    setToBegin(updatedChat);
                    updateChatAtIndexDb(updatedChat);
                });
            })
            .catch(() => setIsListening(false));
    }, [socketId, isLoadedChatsFromIndexDb]);
};
