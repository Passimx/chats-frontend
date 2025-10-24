import { store, useAppAction, useAppSelector } from '../../../store';
import { useCallback, useEffect } from 'react';
import { listenChats } from '../../../api/chats';
import { ChatListenRequestType } from '../../../types/chat/chat-listen-request.type.ts';
import rawChats, { getRawChat, getRawChats } from '../../../store/chats/chats.raw.ts';
import { ChatItemIndexDb, ChatType } from '../../../types/chat/chat.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';

export const useListenAndUpdateChats = () => {
    const { setStateApp, setToBegin, postMessageToBroadCastChannel, setStateChat } = useAppAction();
    const { socketId, isLoadedChatsFromIndexDb, isOnline } = useAppSelector((state) => state.app);
    const compareFn = useCallback((chat1: ChatType, chat2: ChatType) => {
        const firstDate = new Date(chat1.message.createdAt).getTime();
        const secondDate = new Date(chat2.message.createdAt).getTime();

        if (firstDate > secondDate) return 1;
        else return -1;
    }, []);

    useEffect(() => {
        let messageCount = store.getState().chats.messageCount;
        if (!socketId) setStateApp({ isListening: false });
        if (!socketId || !isLoadedChatsFromIndexDb || !isOnline) return;
        if (!getRawChats().length) {
            setStateApp({ isListening: true });
            return;
        }

        const chatsListen: ChatListenRequestType[] = [];
        getRawChats().forEach((chat) =>
            chatsListen.push({
                chatId: chat.id,
                lastMessage: chat.countMessages,
                maxUsersOnline: Number(chat.maxUsersOnline),
            }),
        );

        listenChats(chatsListen)
            .then(({ success, data }) => {
                let isPlayNotification = false;
                const indexDb = rawChats.indexDb;
                if (!indexDb) return;
                if (!success) return;

                /** обновление последнего сообщения и максимально онлайн */
                data.sort(compareFn).forEach((chat) => {
                    const chatFromRaw = getRawChat(chat.id);
                    if (!chatFromRaw) return;
                    const updatedChat: ChatItemIndexDb = { ...chatFromRaw, ...chat };

                    if (updatedChat.countMessages > chatFromRaw.countMessages) {
                        const diff = updatedChat.countMessages - chatFromRaw.countMessages;
                        messageCount += diff;
                        isPlayNotification = true;
                        setToBegin(updatedChat);
                        setStateChat({ messageCount });
                    }
                });

                if (isPlayNotification) postMessageToBroadCastChannel({ event: EventsEnum.PLAY_NOTIFICATION });
                setStateApp({ isListening: true });
            })
            .catch(() => setStateApp({ isListening: false }));
    }, [socketId, isLoadedChatsFromIndexDb, isOnline]);
};
