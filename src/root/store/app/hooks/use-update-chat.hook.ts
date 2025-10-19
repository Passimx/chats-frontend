import { useAppAction } from '../../index.ts';
import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import { getRawChat, getRawChats } from '../../chats/chats.raw.ts';
import { useCallback } from 'react';

export const useUpdateChat = () => {
    const timeUpdate = 200;

    const { addUpdatedChat, setToBegin, removeUpdatedChats, update } = useAppAction();

    return useCallback((payload: ChatItemIndexDb) => {
        const chat: ChatItemIndexDb = { ...payload, key: Date.now() };

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
