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
    const [isLoading, setIsLoading] = useState<LoadingType>();
    const [messageNumber, setMessageNumber] = useState<number>();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);

    const showLastMessages = useCallback(async () => {
        if (!chatOnPage?.messages?.length) return;
        if (isLoading) return;
        const el = document.getElementById(styles.messages)!;

        if (chatOnPage.messages[chatOnPage.messages.length - 1]?.number === chatOnPage.countMessages) {
            el.scrollTo({ behavior: 'smooth', top: el.scrollHeight });
            update({ id: chatOnPage.id, scrollTop: el.scrollHeight });
        } else {
            setChatOnPage({ messages: [chatOnPage.message] });
            setIsLoading(LoadingType.OLD);
            const limit = Envs.settings?.messagesLimit ?? 250;

            const response = await getMessages({
                offset: Math.max(0, chatOnPage.countMessages - limit),
                chatId: chatOnPage.id,
                limit,
            });

            setIsLoading(undefined);
            if (!response.success) return;
            update({ id: chatOnPage.id, messages: response.data });

            const el = document.getElementById(styles.messages)!;
            const ro = new ResizeObserver(() => {
                el.scrollTo({ behavior: 'instant', top: el.scrollHeight });
                ro.disconnect();
            });
            ro.observe(el);
        }
    }, [chatOnPage?.message, isLoading]);

    const findMessage = useCallback(
        async (number: number) => {
            if (!chatOnPage) return;
            setChatOnPage({ messages: [] });
            setIsLoading(LoadingType.OLD);
            setMessageNumber(undefined);

            const response = await getMessages({
                offset: Math.max(0, number - 10),
                chatId: chatOnPage.id,
                limit: Envs.settings?.messagesLimit ?? 250,
            });

            if (!response.success) return;
            setIsLoading(undefined);
            update({ id: chatOnPage.id, messages: response.data });

            requestAnimationFrame(() => {
                setTimeout(() => {
                    const element = document.getElementById(`message-${number}`);
                    element?.scrollIntoView();
                });
            });
        },
        [chatOnPage?.id],
    );

    // /** загрузка первых сообщений */
    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;
        if (!chatOnPage?.id) return;
        setIsLoading(undefined);

        const params = new URLSearchParams(location.search);
        const number = params.get('number');

        /** загрузка сообщений с сервера */
        if (!chatOnPage?.messages?.length && !number) {
            setIsLoading(LoadingType.OLD);
            setChatOnPage({ messages: [chatOnPage.message] });

            const limit = Envs.settings?.messagesLimit || 250;
            const offset = limit * Math.floor((chatOnPage.countMessages - 1) / limit);

            getMessages({ chatId: chatOnPage.id, offset, limit }).then(({ success, data }) => {
                setIsLoading(undefined);
                if (!success) return;

                update({ id: chatOnPage.id, messages: data });
                const el = document.getElementById(styles.messages)!;
                const ro = new ResizeObserver(() => {
                    el.scrollTo({ behavior: 'instant', top: el.scrollHeight });
                    ro.disconnect();
                });
                ro.observe(el);
            });
        }
    }, [chatOnPage?.id, isLoadedChatsFromIndexDb]);

    /** обновление параметра из адресной строки */
    useEffect(() => {
        if (!chatOnPage?.id) return;

        const params = new URLSearchParams(location.search);
        const number = params.get('number');

        if (number) {
            setMessageNumber(Number(number));
            const element = document.getElementById(`message-${number}`);

            if (element) element.scrollIntoView();
            else findMessage(Number(number));
        }
    }, [location, messageNumber, chatOnPage?.id]);

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
