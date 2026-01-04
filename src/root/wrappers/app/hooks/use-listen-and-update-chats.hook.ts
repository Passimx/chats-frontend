import { useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { listenChats } from '../../../api/chats';
import { rawApp } from '../../../store/app/app.raw.ts';

export const useListenAndUpdateChats = () => {
    const { socketId, isLoadedChatsFromIndexDb, isOnline, isListening } = useAppSelector((state) => state.app);
    // const compareFn = useCallback((chat1: ChatType, chat2: ChatType) => {
    //     const createdAt1 = chat1.message?.createdAt;
    //     const createdAt2 = chat2.message?.createdAt;
    //
    //     if (!createdAt1 || !createdAt2) return -1;
    //
    //     const firstDate = new Date(createdAt1).getTime();
    //     const secondDate = new Date(createdAt2).getTime();
    //
    //     if (firstDate > secondDate) return 1;
    //     else return -1;
    // }, []);

    useEffect(() => {
        if (!rawApp.isMainTab) return;
        if (!socketId || !isLoadedChatsFromIndexDb || !isOnline) return;
        if (isListening) return;

        listenChats();

        // const messageCountStart = store.getState().chats.messageCount;
        // const messageCount = messageCountStart;

        // const chatsListen = getRawChats().map<ChatListenRequestType>((chat) => ({
        //     chatId: chat.id,
        //     lastMessage: chat.countMessages,
        //     maxUsersOnline: Number(chat.maxUsersOnline),
        // }));

        // setStateApp({ isListening: true });

        // listenChats(chatsListen)
        //     .then(async ({ success, data }) => {
        //         const indexDb = rawChats.indexDb;
        //         if (!indexDb) return;
        //         if (!success) return;
        //
        //         /** обновление последнего сообщения и максимально онлайн */
        //         data.sort(compareFn).map(async (chat) => {
        //             let updatedChat: ChatItemIndexDb | undefined;
        //
        //             const chatFromRaw = getRawChat(chat.id);
        //
        //             if (chatFromRaw) updatedChat = { ...chatFromRaw, ...chat };
        //             else if (chat.type === ChatEnum.IS_DIALOGUE) {
        //                 updatedChat = await prepareChat(chat);
        //                 if (updatedChat) updatedChat.key = Date.now();
        //             }
        //
        //             if (!updatedChat) return;
        //
        //             const countMessages = chatFromRaw?.countMessages ?? 0;
        //             if (updatedChat.countMessages > countMessages) {
        //                 messageCount += updatedChat.countMessages - countMessages;
        //                 setToBegin(updatedChat);
        //
        //                 // todo
        //                 // доработать логику с join - чтобы это было в одной вкладке
        //                 // и ретранслировалось другим вкладкам и вновь открывшимся вкладкам
        //                 // data.map((chat) => ({ id: chat.id, maxUsersOnline: chat.maxUsersOnline }));
        //
        //                 // postMessageToBroadCastChannel({
        //                 //     event: EventsEnum.UPDATE_CHAT_ONLINE,
        //                 //     data: { success: true, data: [{ id: '', onlineUsers: '2' }] },
        //                 // });
        //             }
        //         });
        //
        //         if (messageCountStart !== messageCount) {
        //             postMessageToBroadCastChannel({ event: EventsEnum.PLAY_NOTIFICATION });
        //             setStateChat({ messageCount });
        //         }
        //
        //         setStateApp({ isListening: true });
        //     })
        //     .catch(() => setStateApp({ isListening: false }));
    }, [socketId, isLoadedChatsFromIndexDb, isOnline, isListening]);
};
