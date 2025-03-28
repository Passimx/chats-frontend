import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../index.module.css';
import { useAppSelector } from '../../../root/store';
import { ChatEnum } from '../../../root/types/chat/chat.enum.ts';
import { useTranslation } from 'react-i18next';
import { UseEnterHookType } from '../types/use-enter-hook.type.ts';
import { createMessage } from '../../../root/api/messages';

export const useEnterHook = (): UseEnterHookType => {
    const { t } = useTranslation();
    const { isPhone } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [isShowPlaceholder, setIsShowPlaceholder] = useState<boolean>(true);

    const placeholder = useMemo((): string => {
        const text = chatOnPage?.type === ChatEnum.IS_SYSTEM ? 'chats_message_unavailable' : 'chats_enter_message';
        return t(text);
    }, [chatOnPage?.type, t]);

    const onInput = useCallback((event: FormEvent<HTMLDivElement>) => {
        const isEmpty = ['', '\n'].includes(event.currentTarget.innerText);
        if (isEmpty) event.currentTarget.innerText = '';
        setIsShowPlaceholder(isEmpty);
    }, []);

    const sendMessage = useCallback(async () => {
        if (!chatOnPage?.id) return;
        const element = document.getElementById(styles.new_message)!;

        const text = element.innerText.replace(/^\n+|\n+$/g, '').trim();
        if (!text.length) return;

        element.innerText = '';
        setIsShowPlaceholder(true);

        // todo
        // const divElement = document.getElementById(styles2.messages)!;
        // divElement.scrollTop = 0;

        await createMessage({ message: text, chatId: chatOnPage.id });
    }, [chatOnPage?.id]);

    useEffect(() => {
        const element = document.getElementById(styles.new_message)!;
        element.innerText = '';
        setIsShowPlaceholder(true);

        // 300 - время анимации, иначе быстро отрабатывает анимация
        setTimeout(() => element.focus(), 300);
    }, [chatOnPage?.id]);

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

    return [sendMessage, onInput, setEmoji, placeholder, isShowPlaceholder];
};
