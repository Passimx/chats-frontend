import { useEffect, useMemo } from 'react';
import styles from '../index.module.css';
import { useAppAction, useAppSelector } from '../../../root/store';

export const useListenScroll = () => {
    const { update } = useAppAction();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const messages = useMemo(() => chatOnPage?.messages, [chatOnPage?.messages]);

    /** отмотка сохраненного значения полосы прокрутки при открытии чата */
    useEffect(() => {
        const messagesBlock = document.getElementById(styles.messages);
        if (!messagesBlock) return;
        const ro = new ResizeObserver(() => {
            messagesBlock.scrollTo({ behavior: 'instant', top: chatOnPage?.scrollTop });
            ro.disconnect();
        });
        ro.observe(messagesBlock);
    }, [chatOnPage?.id]);

    /** сохранение состояния полосы прокрутки */
    useEffect(() => {
        const messagesBlock = document.getElementById(styles.messages)!;
        if (!messagesBlock) return;
        if (!chatOnPage?.id) return;
        let scrollTimeout: NodeJS.Timeout;

        const scrollEnd = () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                update({ id: chatOnPage.id, scrollTop: messagesBlock.scrollTop });
            }, 150);
        };

        messagesBlock.addEventListener('scroll', scrollEnd, { passive: true });
        return () => {
            clearTimeout(scrollTimeout);
            messagesBlock.removeEventListener('scroll', scrollEnd);
        };
    }, [chatOnPage?.id, messages?.length]);
};
