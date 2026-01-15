import { useEffect } from 'react';
import { getRawChat } from '../../../root/store/raw/chats.raw.ts';
import { listenChat, noListenChat } from '../../../root/api/chats';
import { useAppSelector } from '../../../root/store';

export const useJoinChat = () => {
    const { socketId, isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);

    useEffect(() => {
        if (!socketId || !isLoadedChatsFromIndexDb) return;

        if (!chatOnPage) return;
        if (chatOnPage.id && !getRawChat(chatOnPage.id)) listenChat(chatOnPage.id, socketId);

        return () => {
            if (chatOnPage.id && !getRawChat(chatOnPage.id)) noListenChat(chatOnPage.id, socketId);
        };
    }, [chatOnPage?.id, socketId, isLoadedChatsFromIndexDb]);
};
