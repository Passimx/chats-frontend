import { useCallback } from 'react';
import { useAppAction } from '../../root/store';
import { ChatItemIndexDb } from '../../root/types/chat/chat.type.ts';
import { getRawChat, getRawChats } from '../../root/store/raw/chats.raw.ts';

export const useUpdateChat = () => {
    const timeUpdate = 200;

    const { addUpdatedChat, setToBegin, removeUpdatedChats, update } = useAppAction();

    return useCallback((payload?: ChatItemIndexDb) => {
        if (!payload) return;
        const chat: ChatItemIndexDb = { ...payload };

        if (getRawChats()[0]?.id === payload.id) return update(chat);

        addUpdatedChat(chat);

        setTimeout(() => {
            const data = getRawChat(chat.id);
            if (!data) return;
            setToBegin(data);
            removeUpdatedChats(data);
        }, timeUpdate);
    }, []);
};
