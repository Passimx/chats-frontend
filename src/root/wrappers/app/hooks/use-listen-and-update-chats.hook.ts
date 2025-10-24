import { store, useAppAction, useAppSelector } from '../../../store';
import { useCallback, useEffect } from 'react';
import { listenChats } from '../../../api/chats';
import { ChatListenRequestType } from '../../../types/chat/chat-listen-request.type.ts';
import rawChats, { getRawChat, getRawChats } from '../../../store/chats/chats.raw.ts';
import { ChatItemIndexDb, ChatType } from '../../../types/chat/chat.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
// import { rawApp } from '../../../store/app/app.raw.ts';

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
        // todo
        // вернуть
        // if (!rawApp.isMainTab) return;
        if (!socketId) setStateApp({ isListening: false });
        if (!socketId || !isLoadedChatsFromIndexDb || !isOnline) return;
        if (!getRawChats().length) {
            setStateApp({ isListening: true });
            return;
        }

        const messageCountStart = store.getState().chats.messageCount;
        let messageCount = messageCountStart;

        const chatsListen = getRawChats().map<ChatListenRequestType>((chat) => ({
            chatId: chat.id,
            lastMessage: chat.countMessages,
            maxUsersOnline: Number(chat.maxUsersOnline),
        }));

        listenChats(chatsListen)
            .then(({ success, data }) => {
                const indexDb = rawChats.indexDb;
                if (!indexDb) return;
                if (!success) return;

                /** обновление последнего сообщения и максимально онлайн */
                data.sort(compareFn).forEach((chat) => {
                    const chatFromRaw = getRawChat(chat.id);
                    if (!chatFromRaw) return;
                    const updatedChat: ChatItemIndexDb = { ...chatFromRaw, ...chat };

                    if (updatedChat.countMessages > chatFromRaw.countMessages) {
                        messageCount += updatedChat.countMessages - chatFromRaw.countMessages;
                        setToBegin(updatedChat);

                        // todo
                        // доработать логику с join - чтобы это было в одной вкладке
                        // и ретранслировалось другим вкладкам и вновь открывшимся вкладкам
                        // data.map((chat) => ({ id: chat.id, maxUsersOnline: chat.maxUsersOnline }));

                        // postMessageToBroadCastChannel({
                        //     event: EventsEnum.UPDATE_CHAT_ONLINE,
                        //     data: { success: true, data: [{ id: '', onlineUsers: '2' }] },
                        // });
                    }
                });

                if (messageCountStart !== messageCount) {
                    postMessageToBroadCastChannel({ event: EventsEnum.PLAY_NOTIFICATION });
                    setStateChat({ messageCount });
                }

                setStateApp({ isListening: true });
            })
            .catch(() => setStateApp({ isListening: false }));
    }, [socketId, isLoadedChatsFromIndexDb, isOnline]);
};
