import { useAppAction, useAppSelector } from '../../index.ts';
import { ChatType } from '../../../types/chat/chat.type.ts';
import { useEffect } from 'react';

let globChats: ChatType[] = [];

export const useUpdateChat = () => {
    const time = 200;
    const { addUpdatedChat, setToBegin, removeUpdatedChats, update } = useAppAction();
    const { chats } = useAppSelector((state) => state.chats);

    useEffect(() => {
        globChats = chats;
    }, [chats]);

    return (chat: ChatType) => {
        if (globChats[0]?.id === chat.id) return update(chat);

        addUpdatedChat(chat);

        setTimeout(() => {
            setToBegin(chat);
            removeUpdatedChats(chat);
        }, time);
    };
};
