import { MessageType } from '../../../root/types/chat/message.type.ts';
import { useEffect, useState } from 'react';
import styles from '../index.module.css';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';
import { updateChatIndexDb } from '../../../root/store/chats/index-db/hooks.ts';

export const useListenScroll = (messages: MessageType[]): [boolean | undefined] => {
    const { update } = useAppAction();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [isVisibleBottomButton, setIsVisibleBottomButton] = useState<boolean>();

    /** проверка нужно ли показывать кнопку прокрутки сообщений */
    useEffect(() => {
        if (!chatOnPage?.id) return;
        const chat = getRawChat(chatOnPage.id);
        if (!chat || !(chat.scrollTop < -200)) setIsVisibleBottomButton(undefined);
        else setIsVisibleBottomButton(true);
    }, [chatOnPage?.id]);

    /** сохранение скрола вместе с сообщениями */
    /** проверка нужно ли показывать кнопку прокрутки сообщений */
    useEffect(() => {
        if (!chatOnPage?.id || chatOnPage?.id !== messages[0]?.chatId) return;
        const el = document.getElementById(styles.messages)!;
        let scrollTimeout: NodeJS.Timeout;

        const scroll = () => {
            clearTimeout(scrollTimeout);

            if (el.scrollTop < -200) setIsVisibleBottomButton(true);
            else if (isVisibleBottomButton !== undefined) setIsVisibleBottomButton(false);

            scrollTimeout = setTimeout(() => {
                const scrollTop = el.scrollTop;
                if (chatOnPage?.id !== messages[0]?.chatId) return;
                update({ id: chatOnPage.id, scrollTop });
                updateChatIndexDb({ ...chatOnPage, scrollTop });
            }, 150);
        };

        el.addEventListener('scroll', scroll);
        return () => {
            const scrollTop = el.scrollTop;
            clearTimeout(scrollTimeout);
            el.removeEventListener('scroll', scroll);
            update({ id: chatOnPage.id, scrollTop });
        };
    }, [chatOnPage?.id, messages, isVisibleBottomButton]);

    return [isVisibleBottomButton];
};
