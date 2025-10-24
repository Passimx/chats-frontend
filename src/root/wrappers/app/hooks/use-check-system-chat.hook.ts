import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { getSystemChat, listenChats } from '../../../api/chats';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { rawApp } from '../../../store/app/app.raw.ts';

export const useCheckSystemChat = () => {
    const { postMessageToBroadCastChannel } = useAppAction();
    const { systemChatId, isLoadedChatsFromIndexDb, isListening } = useAppSelector((state) => state.app);

    const setSystemChat = async () => {
        const response = await getSystemChat();

        if (response.success) {
            const [chat] = response.data;

            postMessageToBroadCastChannel({
                event: EventsEnum.ADD_CHAT,
                data: { ...chat, readMessage: 0, messages: [], scrollTop: 0, key: Date.now() },
            });
            listenChats([
                { chatId: chat.id, lastMessage: chat.countMessages, maxUsersOnline: Number(chat.maxUsersOnline) },
            ]);
        }
    };

    useEffect(() => {
        if (systemChatId || !isLoadedChatsFromIndexDb || !isListening || !rawApp.isMainTab) return;
        setSystemChat();
    }, [systemChatId, isLoadedChatsFromIndexDb, isListening]);
};
