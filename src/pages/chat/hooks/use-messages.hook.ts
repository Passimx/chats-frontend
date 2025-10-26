import { useCallback, useEffect, useState } from 'react';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getMessages } from '../../../root/api/messages';
import styles from '../index.module.css';
import { UseMessagesType } from '../types/use-messages.type.ts';
import { LoadingType } from '../types/loading.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { useLocation } from 'react-router-dom';

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

            const el = document.getElementById(styles.messages)!;
            const ro = new ResizeObserver(() => {
                const element = document.getElementById(`message-${number}`);
                element?.scrollIntoView();
                ro.disconnect();
            });
            ro.observe(el);
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
            setChatOnPage({ messages: [chatOnPage.message] });
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

    const getNewMessages = () => {};
    const getOldMessages = async (limit: number, offset: number) => {
        if (!chatOnPage?.id) return;

        const response = await getMessages({
            chatId: chatOnPage.id,
            limit,
            offset,
        });

        setIsLoading(undefined);
        if (!response.success) return;
        const messages = [...response.data, ...chatOnPage.messages];
        update({ id: chatOnPage.id, messages });
    };

    /** обновление сообщений */
    useEffect(() => {
        const el = document.getElementById(styles.messages);
        if (!el) return;
        if (!chatOnPage?.messages?.length) return;
        const ro = new ResizeObserver(() => {
            const firstMessage = chatOnPage?.messages[0];
            const lastMessage = chatOnPage?.messages[chatOnPage?.messages.length - 1];

            if (firstMessage && firstMessage.number !== 1) {
                const element = document.getElementById(`message-${firstMessage.number}`);
                if (!element) return;

                const observer = new IntersectionObserver(
                    (entries) => {
                        const entry = entries[0];
                        if (entry.isIntersecting) {
                            const offset = Math.max(
                                Math.min(
                                    firstMessage.number - (Envs.settings?.messagesLimit ?? 250) - 1,
                                    firstMessage.number - 1,
                                ),
                                0,
                            );

                            const limit = Math.min(Envs.settings?.messagesLimit ?? 250, firstMessage.number - 1);

                            const el = document.getElementById(styles.messages)!;
                            const oldScrollHeight = el.scrollHeight;

                            setIsLoading(LoadingType.OLD);
                            getOldMessages(limit, offset).then(() => {
                                setIsLoading(undefined);

                                const ro2 = new ResizeObserver(() => {
                                    // 40px - длина компонента <RotateLoading />
                                    const top = el.scrollHeight - oldScrollHeight - 40;

                                    el.scrollTo({ behavior: 'instant', top });
                                    ro2.disconnect();
                                });
                                ro2.observe(el);

                                observer.disconnect();
                            });
                        }
                    },
                    { threshold: 0.001 },
                );
                observer.observe(element);
            }
            if (lastMessage && lastMessage.number !== chatOnPage.countMessages) {
                const element = document.getElementById(`message-${lastMessage.number}`);
                if (!element) return;

                const observer = new IntersectionObserver(
                    (entries) => {
                        const entry = entries[0];
                        if (entry.isIntersecting) {
                            getNewMessages();
                            observer.disconnect();
                        }
                    },
                    { threshold: 0.001 },
                );
                observer.observe(element);
            }

            ro.disconnect();
        });
        ro.observe(el);

        return () => {};
    }, [chatOnPage?.messages]);

    return [isLoading, showLastMessages];
};
