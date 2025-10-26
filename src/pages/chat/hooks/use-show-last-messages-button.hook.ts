import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../root/store';
import styles from '../index.module.css';

export const useShowLastMessagesButton = (): [boolean | undefined] => {
    const [isShowLastMessagesButton, setIsShowLastMessagesButton] = useState<boolean>();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const messages = useMemo(() => chatOnPage?.messages, [chatOnPage?.messages]);

    /** проверка: нужно ли показывать кнопку прокрутки сообщений */
    useEffect(() => {
        const messagesBlock = document.getElementById(styles.messages);
        if (!messagesBlock) return;
        if (!chatOnPage) return;
        if (!messages?.length) return;

        const lastMessage = messages[messages.length - 1];

        const check = () => {
            const diff = messagesBlock.scrollHeight - messagesBlock.clientHeight;

            // если нет полосы прокрутки
            if (diff === 0) return setIsShowLastMessagesButton(false);
            if (messagesBlock.scrollTop + 200 > diff && lastMessage.number === chatOnPage.countMessages)
                return setIsShowLastMessagesButton(false);

            setIsShowLastMessagesButton(true);
        };

        check();
        messagesBlock.addEventListener('scroll', check);
        return () => messagesBlock.removeEventListener('scroll', check);
    }, [messages, chatOnPage?.message]);

    return [isShowLastMessagesButton];
};
