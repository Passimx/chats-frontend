import { useCallback, useEffect, useState } from 'react';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getMessages } from '../../../root/api/messages';
import styles from '../index.module.css';
import { UseMessagesType } from '../types/use-messages.type.ts';
import { LoadingType } from '../types/loading.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { useLocation } from 'react-router-dom';

// let topMessage: number | undefined;
// let bottomMessage: number | undefined;

export const useMessages = (): UseMessagesType => {
    const location = useLocation();
    const { update, setChatOnPage } = useAppAction();
    const [messageId, setMessageId] = useState<string>();
    const [isLoading, setIsLoading] = useState<LoadingType>();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    // const { postMessageToBroadCastChannel, update } = useAppAction();

    // /** сообщение которое нужно найти */
    // const searchMessageNumber = useMemo(() => {
    //     setIsLoading(undefined);
    //     const params = new URL(document.location.toString()).searchParams;
    //     const messageParam = params.get('message');
    //     console.log(messageParam);
    //     return messageParam ? Number(messageParam) : null;
    // }, [chatOnPage?.id]);

    const showLastMessages = useCallback(() => {
        if (!chatOnPage?.messages?.length) return;
        const el = document.getElementById(styles.messages)!;

        if (chatOnPage.messages[chatOnPage.messages.length - 1]?.number === chatOnPage.countMessages) {
            el.scrollTo({ behavior: 'smooth', top: el.scrollHeight });
            update({ id: chatOnPage.id, scrollTop: el.scrollHeight });
        } else {
            setChatOnPage({ messages: [chatOnPage.message] });
            setIsLoading(LoadingType.OLD);
            //     requestAnimationFrame(() => {
            //         setTimeout(() => {
            //             el.scrollTo({ behavior: 'instant', top: el.scrollHeight });
            //             update({ id: chatOnPage.id, scrollTop: el.scrollHeight });
            //         });
            //     });
        }
    }, [chatOnPage?.messages]);

    const findMessage = useCallback(async () => {
        if (!chatOnPage) return;
        // const el = document.getElementById(styles.messages)!;
        //         const offset =
        //             chatOnPage.countMessages - number > 250
        //                 ? chatOnPage.countMessages - number - Envs.messages.limit + 1
        //                 : 0;
        //         const limit =
        //             chatOnPage.countMessages - number > 250 ? Envs.messages.limit : chatOnPage.countMessages - number + 1;
        setChatOnPage({ messages: [] });
        setIsLoading(LoadingType.OLD);
        //         const response = await getMessages(chatOnPage.id, limit, offset);
        //         if (!response.success) return;
        //         bottomMessage = number;
        //         setIsLoading(undefined);
        //         setMessages(response.data);
        //         requestAnimationFrame(() => {
        //             setTimeout(() => {
        //                 el.scrollTo({ behavior: 'instant', top: -el.scrollHeight });
        //                 update({ id: chatOnPage.id, messages: response.data, scrollTop: el.scrollTop });
        //             });
        //         });
    }, [chatOnPage?.id, messageId]);

    /** загрузка первых сообщений */
    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;
        if (!chatOnPage?.id) return;
        const el = document.getElementById(styles.messages)!;

        /** загрузка сообщений с сервера */
        if (!chatOnPage?.messages?.length) {
            setIsLoading(LoadingType.OLD);
            setChatOnPage({ messages: [chatOnPage.message] });

            const limit = Envs.settings?.messagesLimit || 250;
            const offset = limit * Math.floor((chatOnPage.countMessages - 1) / limit);

            getMessages({ chatId: chatOnPage.id, offset, limit }).then(({ success, data }) => {
                setIsLoading(undefined);
                if (!success) return;

                update({ id: chatOnPage.id, messages: data });
                setChatOnPage({ messages: data });
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        /** смещается на 0.5, чтобы не было моментальной загрузки новых сообщений */
                        el.scrollTo({ behavior: 'instant', top: el.scrollHeight - 0.5 });
                    });
                });
            });
        }
    }, [chatOnPage?.id, isLoadedChatsFromIndexDb]);

    /** обновление параметра из адресной строки */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const message = params.get('message');
        if (message && message !== messageId) setMessageId(message);
    }, [location, messageId]);

    useEffect(() => {
        if (!messageId) return;
        const element = document.getElementById(`message-${messageId}`);
        if (element) element.scrollIntoView();
        else findMessage();
    }, [messageId]);

    // /** загрузка сообщений */
    // const loadMessages = useCallback(
    //     async (number: number) => {
    //         if (!chatOnPage || !messages.length) return;
    //
    //         /** дозагрузка старых сообщений */
    //         if (number === messages[messages.length - 1].number && number !== 1) {
    //             if (topMessage === number) return;
    //             topMessage = number;
    //             const lastMessages = messages.slice(-Envs.messages.limit);
    //
    //             setMessages(lastMessages);
    //
    //             setIsLoading(LoadingType.OLD);
    //             const response = await getMessages(
    //                 chatOnPage.id,
    //                 Envs.messages.limit,
    //                 chatOnPage.countMessages - number + 1,
    //             );
    //             topMessage = undefined;
    //             bottomMessage = undefined;
    //
    //             if (!response.success) return;
    //             const data = [...lastMessages, ...response.data];
    //             setMessages(data);
    //             update({ id: chatOnPage.id, messages: data });
    //             setIsLoading(undefined);
    //         }
    //
    //         /** дозагрузка новых сообщений */
    //         if (number === messages[0].number && number < chatOnPage.countMessages) {
    //             if (bottomMessage === number) return;
    //             bottomMessage = number;
    //             const el = document.getElementById(styles.messages)!;
    //             const lastMessages = messages.slice(0, Envs.messages.limit);
    //             const difference = chatOnPage.countMessages - number;
    //             const limit = difference > Envs.messages.limit ? Envs.messages.limit : difference;
    //             const offset =
    //                 difference > Envs.messages.limit ? chatOnPage.countMessages - number - Envs.messages.limit : 0;
    //
    //             setMessages(lastMessages);
    //
    //             setIsLoading(LoadingType.NEW);
    //             const response = await getMessages(chatOnPage.id, limit, offset);
    //             topMessage = undefined;
    //             bottomMessage = undefined;
    //             const scrollHeight = el.scrollHeight;
    //             if (!response.success) return;
    //             const data = [...response.data, ...lastMessages];
    //             setIsLoading(undefined);
    //             setMessages(data);
    //             update({ id: chatOnPage.id, messages: data });
    //             requestAnimationFrame(() => {
    //                 setTimeout(() => {
    //                     const diff = scrollHeight - el.scrollHeight;
    //                     el.scrollTo({ behavior: 'instant', top: diff });
    //                 });
    //             });
    //         }
    //     },
    //     [chatOnPage, messages],
    // );

    return [isLoading, showLastMessages];
};
