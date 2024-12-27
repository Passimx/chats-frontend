import { ChatType } from '../../../root/types/chat/chat.type.ts';
import { useEffect } from 'react';
import rawChats from '../../../root/store/chats/chats.raw.ts';
import { listenChats } from '../../../root/api/chats';

export const useJoinChat = (chat: ChatType | null) => {
    // ошибка
    // в недобавленный чат приходит сообщение и оно становится добавленным((
    useEffect(() => {
        if (!chat) return;
        if (!rawChats.chats.get(chat.id)) listenChats([chat.id]);

        return () => {
            if (!rawChats.chats.get(chat.id)) alert('Leave chat');
        };
    }, [chat]);
};
