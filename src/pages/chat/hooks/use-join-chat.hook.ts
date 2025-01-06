import { ChatType } from '../../../root/types/chat/chat.type.ts';
import { useEffect } from 'react';
import rawChats from '../../../root/store/chats/chats.raw.ts';
import { leaveChats, listenChats } from '../../../root/api/chats';
import { useAppAction } from '../../../root/store';

export const useJoinChat = (chat: ChatType | null) => {
    const { setChatOnPage } = useAppAction();

    useEffect(() => {
        if (!chat) return;
        if (!rawChats.chats.get(chat.id)) listenChats([{ chatId: chat.id, lastMessage: chat.countMessages }]);

        return () => {
            if (!rawChats.chats.get(chat.id)) leaveChats([chat.id]);
            setChatOnPage(null);
        };
    }, [chat]);
};
