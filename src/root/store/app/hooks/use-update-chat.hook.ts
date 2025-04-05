import { useAppAction, useAppSelector } from '../../index.ts';
import { ChatItemIndexDb, ChatType } from '../../../types/chat/chat.type.ts';
import { useEffect } from 'react';
import { getRawChat } from '../../chats/chats.raw.ts';

let globChats: ChatType[] = [];

export const useUpdateChat = () => {
    const time = 200;
    const { addUpdatedChat, setToBegin, removeUpdatedChats, update } = useAppAction();
    const { chats } = useAppSelector((state) => state.chats);

    useEffect(() => {
        globChats = chats;
    }, [chats]);

    return (chat: ChatItemIndexDb) => {
        if (globChats[0]?.id === chat.id) return update(chat);

        addUpdatedChat(chat);

        setTimeout(() => {
            chat = getRawChat(chat.id)!;
            setToBegin(chat);
            removeUpdatedChats(chat);
        }, time);
    };
};
