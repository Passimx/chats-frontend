import { MessageType } from '../../../root/types/chat/message.type.ts';
import { useCallback, useEffect, useState } from 'react';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getMessages } from '../../../root/api/messages';
import { EventsEnum } from '../../../root/types/events/events.enum.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import styles from '../index.module.css';

type R = [MessageType[], (chatId: string, number: number) => void];
let topMessage: number | undefined;
let bottomMessage: number | undefined;

export const useMessages = (): R => {
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { postMessageToBroadCastChannel, update } = useAppAction();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        if (
            chatOnPage &&
            chatOnPage.message.number === messages[0]?.number + 1 &&
            messages[0].chatId === chatOnPage.id
        ) {
            const el = document.getElementById(styles.messages)!;
            const scrollHeight = el.scrollHeight;

            setMessages([chatOnPage.message, ...messages]);

            const chat = getRawChat(chatOnPage.id);
            if (!chat) return;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const scrollTop = chat.scrollTop + scrollHeight - el.scrollHeight;
                    el.scrollTo({ behavior: 'instant', top: scrollTop });
                    update({ id: chatOnPage.id, messages, scrollTop });
                });
            });
        }
    }, [chatOnPage?.message]);

    /** загрузка первых сообщений */
    useEffect(() => {
        if (!chatOnPage?.id) return;
        if (!isLoadedChatsFromIndexDb) return;

        topMessage = undefined;
        bottomMessage = undefined;
        const chat = getRawChat(chatOnPage.id);

        if (chat) {
            const el = document.getElementById(styles.messages)!;
            setMessages(chat.messages);

            /** установка скрола */
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.scrollTo({ behavior: 'instant', top: chat.scrollTop });
                });
            });
        } else {
            setMessages([]);
            getMessages(chatOnPage.id).then(({ success, data }) => {
                if (success) setMessages(data);
            });
        }
    }, [chatOnPage?.id, isLoadedChatsFromIndexDb]);

    /** сохранение скрола вместе с сообщениями*/
    useEffect(() => {
        if (!chatOnPage?.id || chatOnPage?.id !== messages[0]?.chatId) return;
        const el = document.getElementById(styles.messages)!;
        let scrollTimeout: NodeJS.Timeout;

        const scroll = () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                const scrollTop = el.scrollTop;
                update({ id: chatOnPage.id, messages, scrollTop });
            }, 150);
        };

        el.addEventListener('scroll', scroll);
        return () => {
            clearTimeout(scrollTimeout);
            el.removeEventListener('scroll', scroll);
        };
    }, [chatOnPage?.id, messages]);

    /** загрузка сообщений */
    const loadMessages = useCallback(
        async (number: number) => {
            if (!chatOnPage || !messages.length) return;

            /** дозагрузка старых сообщений */
            if (number === messages[messages.length - 1].number && number !== 1) {
                if (topMessage === number) return;
                topMessage = number;
                const lastMessages = messages.slice(-Envs.messages.limit);

                setMessages(lastMessages);

                const response = await getMessages(
                    chatOnPage.id,
                    Envs.messages.limit,
                    chatOnPage.countMessages - number + 1,
                );

                if (!response.success) return;
                const data = [...lastMessages, ...response.data];
                setMessages(data);
            }

            /** дозагрузка новых сообщений */
            if (number === messages[0].number && number < chatOnPage.countMessages) {
                if (bottomMessage === number) return;
                bottomMessage = number;
                const el = document.getElementById(styles.messages)!;
                const lastMessages = messages.slice(0, Envs.messages.limit);
                const difference = chatOnPage.countMessages - number;
                const limit = difference > Envs.messages.limit ? Envs.messages.limit : difference;
                const offset =
                    difference > Envs.messages.limit ? chatOnPage.countMessages - number - Envs.messages.limit : 0;

                setMessages(lastMessages);

                const response = await getMessages(chatOnPage.id, limit, offset);
                const scrollHeight = el.scrollHeight;
                if (!response.success) return;
                const data = [...response.data, ...lastMessages];
                setMessages(data);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const diff = scrollHeight - el.scrollHeight;
                        el.scrollTo({ behavior: 'instant', top: diff });
                    });
                });
            }
        },
        [chatOnPage, messages],
    );

    const readMessage = useCallback(
        (chatId: string, number: number) => {
            if (!chatOnPage || chatId !== chatOnPage.id || !messages.length) return;

            /** загрузка сообщений */
            loadMessages(number);

            const num = getRawChat(chatId)?.readMessage;
            if (num !== undefined && number > num)
                postMessageToBroadCastChannel({ event: EventsEnum.READ_MESSAGE, data: { chatId, number } });
        },
        [chatOnPage?.id, messages.length],
    );

    return [messages, readMessage];
};
