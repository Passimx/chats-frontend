import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { getSystemChat, listenChats } from '../../../api/chats';
import { EventsEnum } from '../../../types/events/events.enum.ts';

export const useCheckSystemChat = () => {
    const { postMessageToBroadCastChannel } = useAppAction();
    const { systemChatId, isLoadedChatsFromIndexDb, isListening } = useAppSelector((state) => state.app);

    const setSystemChat = async () => {
        const response = await getSystemChat();

        if (response.success) {
            const [chat] = response.data;

            postMessageToBroadCastChannel({
                event: EventsEnum.ADD_CHAT,
                data: { ...chat, readMessage: 0, messages: [chat.message], scrollTop: 0 },
            });
            listenChats([
                { chatId: chat.id, lastMessage: chat.countMessages, maxUsersOnline: Number(chat.maxUsersOnline) },
            ]);
        }
    };

    useEffect(() => {
        if (systemChatId || !isLoadedChatsFromIndexDb || !isListening) return;
        setSystemChat();
    }, [systemChatId, isLoadedChatsFromIndexDb, isListening]);
};
