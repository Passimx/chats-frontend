import { useEffect } from 'react';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';
import { leaveChats, listenChats } from '../../../root/api/chats';
import { useAppSelector } from '../../../root/store';

export const useJoinChat = () => {
    const { socketId, isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);

    useEffect(() => {
        if (!socketId || !isLoadedChatsFromIndexDb) return;

        if (!chatOnPage) return;
        if (!getRawChat(chatOnPage.id))
            listenChats([
                {
                    chatId: chatOnPage.id,
                    lastMessage: chatOnPage.countMessages,
                    maxUsersOnline: Number(chatOnPage.maxUsersOnline),
                },
            ]);

        return () => {
            if (!getRawChat(chatOnPage.id)) leaveChats([chatOnPage.id]);
        };
    }, [chatOnPage?.id, socketId, isLoadedChatsFromIndexDb]);
};
