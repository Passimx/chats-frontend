import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import ChatsRaw from '../../../store/chats/chats.raw.ts';
import { listenChats } from '../../../api/chats';

export const useListenAndUpdateChats = () => {
    const { socketId } = useAppSelector((state) => state.app);
    const { isListening } = useAppSelector((state) => state.app);

    const { setIsListening } = useAppAction();

    useEffect(() => {
        if (!socketId || !ChatsRaw.chats.size || isListening) return;

        listenChats(Array.from(ChatsRaw.chats.keys()))
            .then(() => setIsListening(true))
            .catch(() => setIsListening(false));

        // todo
        // добавить логику на обновление информации чатов
    }, [socketId]);
};
