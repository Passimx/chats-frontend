import { useEffect, useState } from 'react';
import styles from '../index.module.css';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';

export const useListenScroll = (): [boolean | undefined] => {
    const { update } = useAppAction();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [isVisibleBottomButton, setIsVisibleBottomButton] = useState<boolean>();
    const messages = chatOnPage?.messages;

    /** проверка нужно ли показывать кнопку прокрутки сообщений при открытии чата*/
    useEffect(() => {
        if (!chatOnPage?.id) return;

        const el = document.getElementById(styles.messages)!;
        const scrollTop = chatOnPage.scrollTop - (el.scrollHeight - el.clientHeight);

        const chat = getRawChat(chatOnPage.id);
        if (!chat || !(scrollTop < -200)) setIsVisibleBottomButton(undefined);
        else setIsVisibleBottomButton(true);
    }, [chatOnPage?.id]);

    /** сохранение скрола вместе с сообщениями */
    /** проверка нужно ли показывать кнопку прокрутки сообщений */
    useEffect(() => {
        if (!messages?.length || chatOnPage?.id !== messages[0]?.chatId) return;
        const el = document.getElementById(styles.messages)!;
        let scrollTimeout: NodeJS.Timeout;

        const scroll = () => {
            clearTimeout(scrollTimeout);
            const scrollTop = el.scrollTop - (el.scrollHeight - el.clientHeight);

            if (scrollTop < -200) setIsVisibleBottomButton(true);
            else if (isVisibleBottomButton !== undefined) setIsVisibleBottomButton(false);

            scrollTimeout = setTimeout(() => {
                const scrollTop = el.scrollTop;
                if (chatOnPage?.id !== messages[0]?.chatId) return;
                update({ id: chatOnPage.id, scrollTop });
            }, 150);
        };

        el.addEventListener('scroll', scroll);
        return () => {
            clearTimeout(scrollTimeout);
            el.removeEventListener('scroll', scroll);
        };
    }, [chatOnPage?.id, messages, isVisibleBottomButton]);

    return [isVisibleBottomButton];
};
