import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../index.module.css';
import { useAppAction, useAppSelector } from '../../../root/store';
import { ChatEnum } from '../../../root/types/chat/chat.enum.ts';
import { useTranslation } from 'react-i18next';
import { UseEnterHookType } from '../types/use-enter-hook.type.ts';
import { createMessage } from '../../../root/api/messages';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';
import { focusToEnd } from '../common/focus-to-end.ts';
import { getIsFocused } from './get-is-focused.hook.ts';

export const useEnterHook = (): UseEnterHookType => {
    const { t } = useTranslation();
    const { update } = useAppAction();
    const [isShowPlaceholder, setIsShowPlaceholder] = useState<boolean>(true);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { isPhone, isOpenMobileKeyboard } = useAppSelector((state) => state.app);

    const placeholder = useMemo((): string => {
        return String(isOpenMobileKeyboard);
        const text = chatOnPage?.type === ChatEnum.IS_SYSTEM ? 'chats_message_unavailable' : 'chats_enter_message';
        return t(text);
    }, [chatOnPage?.type, t, isOpenMobileKeyboard]);

    const onInput = useCallback(() => {
        const el = document.getElementById(styles.new_message)!;

        const isEmpty = ['', '\n'].includes(el.innerText);
        if (isEmpty) el.innerText = '';
        setIsShowPlaceholder(isEmpty);
        if (chatOnPage?.id) {
            const isText = !!el.innerText.replace(/^\n+|\n+$/g, '').trim()?.length;

            update({ id: chatOnPage.id, inputMessage: isText ? el.innerText : undefined });
        }
    }, [chatOnPage?.id]);

    const sendMessage = useCallback(async () => {
        if (!chatOnPage?.id) return;
        const element = document.getElementById(styles.new_message)!;
        const isFocused = isPhone ? isOpenMobileKeyboard : getIsFocused();

        const text = element.innerText.replace(/^\n+|\n+$/g, '').trim();
        if (!text.length) return;

        element.innerText = '';
        if (isFocused) element.focus();
        setIsShowPlaceholder(true);

        update({ id: chatOnPage.id, inputMessage: undefined });

        await createMessage({ message: `${isOpenMobileKeyboard}`, chatId: chatOnPage.id });
    }, [chatOnPage?.id, isPhone, isOpenMobileKeyboard]);

    useEffect(() => {
        if (!chatOnPage?.id) return;

        const element = document.getElementById(styles.new_message)!;
        const text = getRawChat(chatOnPage.id)?.inputMessage;

        element.innerText = text ?? '';
        setIsShowPlaceholder(!text);

        // // 300 - время анимации, иначе быстро отрабатывает анимация
        setTimeout(() => focusToEnd(element), 300);
    }, [chatOnPage?.id]);

    useEffect(() => {
        const element = document.getElementById(styles.new_message)!;

        const preventDefault = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !isPhone && !event.shiftKey) event.preventDefault();
        };

        const send = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !isPhone && !event.shiftKey) sendMessage();
        };

        element.addEventListener('keypress', preventDefault);
        element.addEventListener('keyup', send);

        return () => {
            element.removeEventListener('keypress', preventDefault);
            element.removeEventListener('keyup', send);
        };
    }, [chatOnPage?.id, isPhone]);

    const setEmoji = useCallback(
        (emoji: string) => {
            const chatInput = document.getElementById(styles.new_message)!;
            const isFocused = isPhone ? isOpenMobileKeyboard : getIsFocused();

            setIsShowPlaceholder(false);
            const selection = window.getSelection()!;
            let range;

            // Проверяем, есть ли уже выделение (фокус внутри div)
            if (selection.rangeCount > 0 && chatInput.contains(selection.anchorNode)) {
                range = selection.getRangeAt(0);
            } else {
                // Если курсор не внутри div, создаём новый range в КОНЦЕ div
                if (isFocused) chatInput.focus();
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

            if (isFocused)
                chatInput.focus(); // Поддерживаем фокус на div
            else chatInput.blur();
            onInput();
        },
        [chatOnPage?.id, isPhone, isOpenMobileKeyboard],
    );

    return [sendMessage, onInput, setEmoji, placeholder, isShowPlaceholder];
};
