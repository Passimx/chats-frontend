import { ChatType } from '../../../root/types/chat/chat.type.ts';
import { useEffect } from 'react';
import rawChats from '../../../root/store/chats/chats.raw.ts';
import { leaveChats, listenChats } from '../../../root/api/chats';
import { useAppAction, useAppSelector } from '../../../root/store';

export const useJoinChat = (chat: ChatType | null) => {
    const { setSearchChat } = useAppAction();
    const { chats } = useAppSelector((state) => state.chats);
    useEffect(() => {
        if (!chat) return;
        if (!rawChats.chats.get(chat.id)) listenChats([chat.id]);

        return () => {
            if (!rawChats.chats.get(chat.id)) leaveChats([chat.id]);
            setSearchChat(null);
        };
    }, [chat, chats]);
};
