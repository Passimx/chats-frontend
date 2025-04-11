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
    const { postMessageToBroadCastChannel } = useAppAction();
    const { chatOnPage, chats } = useAppSelector((state) => state.chats);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        if (chatOnPage && chatOnPage.message.number === messages[0]?.number + 1 && messages[0].chatId === chatOnPage.id)
            setMessages([chatOnPage.message, ...messages]);
    }, [chatOnPage?.message]);

    // загрузка первых сообщений
    useEffect(() => {
        if (!chatOnPage?.id) return;
        if (!isLoadedChatsFromIndexDb) return;

        topMessage = undefined;
        bottomMessage = undefined;
        const chat = getRawChat(chatOnPage.id);

        if (chat) setMessages(chat.messages);
        else {
            setMessages([]);
            getMessages(chatOnPage.id).then(({ success, data }) => {
                if (success) setMessages(data);
            });
        }
    }, [chatOnPage?.id, isLoadedChatsFromIndexDb]);

    // todo
    // добавить сохранение
    const loadMessages = useCallback(
        async (number: number) => {
            if (!chatOnPage || !messages.length) return;

            // дозагрузка старых сообщений
            if (number === messages[messages.length - 1].number && number !== 1) {
                if (topMessage === number) return;
                topMessage = number;
                const response = await getMessages(
                    chatOnPage.id,
                    Envs.messages.limit,
                    chatOnPage.countMessages - number + 1,
                );

                if (response.success) setMessages([...messages, ...response.data]);
            }

            // дозагрузка новых сообщений
            if (number === messages[0].number && number !== chatOnPage.countMessages) {
                if (bottomMessage === number) return;
                bottomMessage = number;
                const difference = chatOnPage.countMessages - number;
                const limit = difference > Envs.messages.limit ? Envs.messages.limit : difference;
                const offset =
                    difference > Envs.messages.limit ? chatOnPage.countMessages - number - Envs.messages.limit : 0;

                const response = await getMessages(chatOnPage.id, limit, offset);
                const el = document.getElementById(styles.messages)!;
                const scrollHeight = el.scrollHeight;
                if (response.success) setMessages([...response.data, ...messages]);

                requestAnimationFrame(() => {
                    const diff = scrollHeight - el.scrollHeight;
                    el.scrollTo({ behavior: 'instant', top: diff });

                    requestAnimationFrame(() => {
                        const diff = scrollHeight - el.scrollHeight;
                        el.scrollTo({ behavior: 'instant', top: diff });

                        requestAnimationFrame(() => {
                            const diff = scrollHeight - el.scrollHeight;
                            el.scrollTo({ behavior: 'instant', top: diff });

                            requestAnimationFrame(() => {
                                const diff = scrollHeight - el.scrollHeight;
                                el.scrollTo({ behavior: 'instant', top: diff });
                            });
                        });
                    });
                });
            }
        },
        [chatOnPage?.id, messages.length],
    );

    const readMessage = useCallback(
        (chatId: string, number: number) => {
            if (!chatOnPage || chatId !== chatOnPage.id || !messages.length) return;

            // дозагрузка сообщений
            loadMessages(number);

            const num = getRawChat(chatId)?.readMessage;
            if (num !== undefined && number > num)
                postMessageToBroadCastChannel({ event: EventsEnum.READ_MESSAGE, data: { chatId, number } });
        },
        [chatOnPage?.id, chats, messages.length],
    );

    return [messages, readMessage];
};
