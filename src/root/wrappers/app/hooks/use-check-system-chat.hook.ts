import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { getSystemChat, listenChats } from '../../../api/chats';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { useLoadSoundsHooks } from './use-load-sounds.hooks.ts';

export const useCheckSystemChat = () => {
    const [playNotificationSound] = useLoadSoundsHooks();
    const { postMessageToBroadCastChannel } = useAppAction();
    const { isSystemChat, isLoadedChatsFromIndexDb, isListening } = useAppSelector((state) => state.app);

    const setSystemChat = async () => {
        const response = await getSystemChat();

        if (response.success) {
            const chat = response.data;
            postMessageToBroadCastChannel({
                event: EventsEnum.ADD_CHAT,
                data: { ...chat, readMessage: 0, messages: [chat.message] },
            });
            listenChats([{ chatId: chat.id, lastMessage: 0 }]);
            playNotificationSound();
        }
    };

    useEffect(() => {
        if (isSystemChat || !isLoadedChatsFromIndexDb || !isListening) return;
        setSystemChat();
    }, [isSystemChat, isLoadedChatsFromIndexDb, isListening]);
};
