import { FormEvent, useCallback, useEffect, useState } from 'react';
import styles from '../index.module.css';
import { useParams } from 'react-router-dom';
import styles2 from '../../../pages/chat/index.module.css';
import { createMessage } from '../../../root/api/chats';
import { useAppSelector } from '../../../root/store';

let globalChatId: string;

export const useEnterHook = (): [
    () => Promise<void>,
    (event: FormEvent<HTMLDivElement>) => void,
    (emoji: string) => void,
    boolean,
] => {
    const { id } = useParams();
    const { isPhone } = useAppSelector((state) => state.app);
    const [isShowPlaceholder, setIsShowPlaceholder] = useState<boolean>(true);

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

        // hide
        document.getElementById(styles2.messages)!;
        // todo
        // const divElement = document.getElementById(styles2.messages)!;
        // divElement.scrollTop = 0;

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
            if (event.code === 'Enter' && !isPhone && !event.shiftKey) event.preventDefault();
        });

        element.addEventListener('keyup', (event) => {
            if (event.code === 'Enter' && !isPhone && !event.shiftKey) sendMessage();
        });
    }, []);

    const setEmoji = useCallback((emoji: string) => {
        const chatInput = document.getElementById(styles.new_message)!;
        setIsShowPlaceholder(false);
        const selection = window.getSelection()!;
        let range = null;

        // Проверяем, есть ли уже выделение (фокус внутри div)
        if (selection.rangeCount > 0 && chatInput.contains(selection.anchorNode)) {
            range = selection.getRangeAt(0);
        } else {
            // Если курсор не внутри div, создаём новый range в КОНЦЕ div
            chatInput.focus();
            range = document.createRange();
            range.selectNodeContents(chatInput);
            range.collapse(false); // false делает курсор в конец
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Вставляем эмодзи в то место, где курсор
        const textNode = document.createTextNode(emoji);
        range.deleteContents();
        range.insertNode(textNode);

        // Перемещаем курсор за эмодзи, чтобы печатать дальше
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);

        chatInput.focus(); // Поддерживаем фокус на div
    }, []);

    return [sendMessage, onInput, setEmoji, isShowPlaceholder];
};
