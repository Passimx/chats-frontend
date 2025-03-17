import { useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { getSystemChat, listenChats } from '../../../api/chats';
import { useAppEvents } from './use-app-events.hook.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';

export const useCheckSystemChat = () => {
    const postMessage = useAppEvents();
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);

    const setSystemChat = async () => {
        const response = await getSystemChat();

        if (response.success) {
            const chat = response.data;
            postMessage({ event: EventsEnum.ADD_CHAT, data: { ...chat, readMessage: 0, messages: [chat.message] } });
            listenChats([{ chatId: chat.id, lastMessage: 0 }]);
        }
    };

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;
        setSystemChat();
    }, [isLoadedChatsFromIndexDb]);
};
