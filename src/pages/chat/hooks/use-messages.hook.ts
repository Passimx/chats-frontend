import { MessageType } from '../../../root/types/chat/message.type.ts';
import { useCallback, useEffect, useState } from 'react';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getMessages } from '../../../root/api/messages';
import { EventsEnum } from '../../../root/types/events/events.enum.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import styles from '../index.module.css';

type R = [boolean, MessageType[], (chatId: string, number: number) => void, () => void, (payload: MessageType) => void];
let topMessage: number | undefined;
let bottomMessage: number | undefined;

export const useMessages = (): R => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const { postMessageToBroadCastChannel, update } = useAppAction();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);

    /** обновление нового сообщения */
    useEffect(() => {
        if (
            chatOnPage &&
            chatOnPage.message.number === messages[0]?.number + 1 &&
            messages[0].chatId === chatOnPage.id
        ) {
            const el = document.getElementById(styles.messages)!;
            const scrollHeight = el.scrollHeight;
            const scrollTop = el.scrollTop;

            setMessages([chatOnPage.message, ...messages]);

            const chat = getRawChat(chatOnPage.id);
            if (!chat) return;

            if (scrollTop === 0) return;
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
            setIsLoading(true);
            getMessages(chatOnPage.id).then(({ success, data }) => {
                if (success) setMessages(data);
                setIsLoading(false);
            });
        }
    }, [chatOnPage?.id, isLoadedChatsFromIndexDb]);

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

                setIsLoading(true);
                const response = await getMessages(
                    chatOnPage.id,
                    Envs.messages.limit,
                    chatOnPage.countMessages - number + 1,
                );
                topMessage = undefined;
                bottomMessage = undefined;

                if (!response.success) return;
                const data = [...lastMessages, ...response.data];
                setMessages(data);
                update({ id: chatOnPage.id, messages: data });
                setIsLoading(false);
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

                setIsLoading(true);
                const response = await getMessages(chatOnPage.id, limit, offset);
                topMessage = undefined;
                bottomMessage = undefined;
                const scrollHeight = el.scrollHeight;
                if (!response.success) return;
                const data = [...response.data, ...lastMessages];
                setIsLoading(false);
                setMessages(data);
                update({ id: chatOnPage.id, messages: data });
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
        (id: string, readMessage: number) => {
            if (!chatOnPage || id !== chatOnPage.id || !messages.length) return;

            /** загрузка сообщений */
            loadMessages(readMessage);

            const num = getRawChat(id)?.readMessage;
            if (num !== undefined && readMessage > num)
                postMessageToBroadCastChannel({
                    event: EventsEnum.READ_MESSAGE,
                    data: { id, readMessage },
                });
        },
        [chatOnPage?.id, messages.length],
    );

    const showLastMessages = useCallback(() => {
        if (!chatOnPage || messages[0]?.chatId !== chatOnPage.id) return;
        const el = document.getElementById(styles.messages)!;

        if (messages[0]?.number === chatOnPage.countMessages) {
            el.scrollTo({ behavior: 'smooth', top: 0 });
            update({ id: chatOnPage.id, scrollTop: 0 });
        } else {
            setMessages([chatOnPage.message]);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.scrollTo({ behavior: 'instant', top: 0 });
                    update({ id: chatOnPage.id, scrollTop: 0 });
                });
            });
            setIsLoading(true);
        }
    }, [chatOnPage, messages]);

    const findMessage = useCallback((payload: MessageType) => {
        console.log(payload);
    }, []);

    return [isLoading, messages, readMessage, showLastMessages, findMessage];
};
