import { FormEvent, useEffect, useState } from 'react';
import styles from '../index.module.css';
import { useParams } from 'react-router-dom';
import styles2 from '../../../pages/chat/index.module.css';
import { createMessage } from '../../../root/api/chats';

let globalChatId: string;

export const useEnterHook = (): [() => Promise<void>, (event: FormEvent<HTMLDivElement>) => void, boolean] => {
    const [isShowPlaceholder, setIsShowPlaceholder] = useState<boolean>(true);
    const { id } = useParams();

    const onInput = (event: FormEvent<HTMLDivElement>) => {
        const isEmpty = ['', '\n'].includes(event.currentTarget.innerText);
        if (isEmpty) event.currentTarget.innerText = '';
        setIsShowPlaceholder(isEmpty);
    };

    const sendMessage = async (): Promise<void> => {
        const element = document.getElementById(styles.new_message)!;

        const message = element.innerText.replace(/^\n+|\n+$/g, '').trim();
        if (!message.length) return;

        element.innerText = '';
        setIsShowPlaceholder(true);

        const divElement = document.getElementById(styles2.messages)!;
        divElement.scrollTop = 0;

        await createMessage({ message, chatId: globalChatId });
    };

    useEffect(() => {
        const element = document.getElementById(styles.new_message)!;
        element.innerText = '';
        setIsShowPlaceholder(true);

        globalChatId = String(id);
        // 300 - время анимации, иначе быстро отрабатывает анимация
        setTimeout(() => element.focus(), 300);
    }, [id]);

    useEffect(() => {
        const element = document.getElementById(styles.new_message)!;

        element.addEventListener('keypress', (event) => {
            if (event.code === 'Enter' && !event.shiftKey) event.preventDefault();
        });

        element.addEventListener('keyup', (event) => {
            if (event.code === 'Enter' && !event.shiftKey) sendMessage();
        });
    }, []);

    return [sendMessage, onInput, isShowPlaceholder];
};
