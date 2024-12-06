import { useAppAction, useAppSelector } from '../../index.ts';
import { ChatType } from '../../../types/chat/chat.type.ts';
import rawChats from '../../chats/chats.raw.ts';
import { useEffect } from 'react';

let chatsGlobal: ChatType[] = [];
export const useUpdateChat = () => {
    const time = 200;
    const { setToBegin, changeUpdatedChats, update } = useAppAction();
    const { chats } = useAppSelector((state) => state.chats);

    useEffect(() => {
        chatsGlobal = chats;
    }, [chats]);

    return (chat: ChatType) => {
        if (chatsGlobal[0] && chatsGlobal[0].id === chat.id) return setToBegin(chat);

        rawChats.updatedChats.delete(chat.id);

        rawChats.updatedChats.set(chat.id, chat);
        changeUpdatedChats([...Array.from(rawChats.updatedChats.values())].reverse());

        update(chat);

        setTimeout(() => {
            setToBegin(chat);
            rawChats.updatedChats.delete(chat.id);
            changeUpdatedChats(Array.from(rawChats.updatedChats.values()));
        }, time);
    };
};
