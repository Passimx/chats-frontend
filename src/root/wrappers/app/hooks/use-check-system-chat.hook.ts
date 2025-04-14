import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { getSystemChat, listenChats } from '../../../api/chats';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { useLoadSoundsHooks } from './use-load-sounds.hooks.ts';
import styles from '../../../../pages/chat/index.module.css';

export const useCheckSystemChat = () => {
    const [playNotificationSound] = useLoadSoundsHooks();
    const { postMessageToBroadCastChannel } = useAppAction();
    const { isSystemChat, isLoadedChatsFromIndexDb, isListening } = useAppSelector((state) => state.app);

    const setSystemChat = async () => {
        const response = await getSystemChat();

        if (response.success) {
            const chat = response.data;
            const el = document.getElementById(styles.messages)!;
            const scrollTop = el.scrollTop;

            postMessageToBroadCastChannel({
                event: EventsEnum.ADD_CHAT,
                data: { ...chat, readMessage: 0, messages: [chat.message], scrollTop },
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
