import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import ChatsRaw from '../../../store/chats/chats.raw.ts';
import { listenChats } from '../../../api/chats';

export const useListenAndUpdateChats = () => {
    const { socketId, isListening } = useAppSelector((state) => state.app);
    const { chats } = useAppSelector((state) => state.chats);
    const { setIsListening } = useAppAction();

    useEffect(() => {
        if (!socketId || !ChatsRaw.chats.size || isListening) return;

        listenChats(Array.from(ChatsRaw.chats.keys()))
            .then(() => setIsListening(true))
            .catch(() => setIsListening(false));

        // todo
        // добавить логику на обновление информации чатов
    }, [socketId, chats]);
};
