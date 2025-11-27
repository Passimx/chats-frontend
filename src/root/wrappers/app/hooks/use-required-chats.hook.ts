import { useAppAction, useAppSelector } from '../../../store';
import { useEffect, useState } from 'react';
import { getSystemChat, listenChats } from '../../../api/chats';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { rawApp } from '../../../store/app/app.raw.ts';
import { MessageType } from '../../../types/chat/message.type.ts';

export const useRequiredChats = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { postMessageToBroadCastChannel } = useAppAction();
    const { systemChatName, isLoadedChatsFromIndexDb, isListening } = useAppSelector((state) => state.app);

    const setSystemChat = async () => {
        const response = await getSystemChat();

        if (response.success) {
            if (!response.data.length) return;
            const [chat] = response.data;

            const messages: MessageType[] = [];
            if (chat.message) messages.push(chat.message);

            postMessageToBroadCastChannel({
                event: EventsEnum.ADD_CHAT,
                data: { ...chat, readMessage: 0, messages, scrollTop: 0, key: Date.now() },
            });
            listenChats([
                { name: chat?.name, lastMessage: chat?.countMessages, maxUsersOnline: Number(chat?.maxUsersOnline) },
            ]);
        }
    };

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb || !isListening || !rawApp.isMainTab || isLoaded) return;
        setIsLoaded(true);

        if (!systemChatName) setSystemChat();
    }, [systemChatName, isLoadedChatsFromIndexDb, isListening, isLoaded]);
};
