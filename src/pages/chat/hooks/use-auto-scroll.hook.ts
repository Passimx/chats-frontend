import { useContext, useEffect } from 'react';
import { useAppSelector } from '../../../root/store';
import styles from '../index.module.css';
import { ContextChat } from '../context/chat-context.tsx';

export const useAutoScroll = () => {
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const ownUserName = useAppSelector((state) => state.user.userName);
    const chatContext = useContext(ContextChat);

    const scrollToBottom = () => {
        if (!chatOnPage?.id) return;
        const container = document.getElementById(styles.messages);
        if (!container) return;
        const targetScrollTop = container.scrollHeight;
        const startScrollTop = container.scrollTop;
        const distance = targetScrollTop - startScrollTop;
        const duration = 900; // Milliseconds
        let startTime = 0;

        const animation = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

            container.scrollTop = startScrollTop + distance * easeInOutCubic(progress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    const isScrolledToBottom = (element: HTMLElement | null) => {
        if (!element) return false;
        const { scrollTop, scrollHeight, clientHeight } = element;
        const threshold = 100;
        return Math.abs(scrollHeight - scrollTop - clientHeight) < threshold;
    };

    useEffect(() => {
        if (!chatOnPage?.messages) return;
        const container = document.getElementById(styles.messages);

        const timer = setTimeout(() => {
            if (chatContext?.isShowLastMessagesButton) {
                const isNewMessage = chatOnPage.countMessages > chatOnPage.readMessage;
                if (isNewMessage) {
                    const lastMessage = chatOnPage.messages[chatOnPage.messages.length - 1];
                    const username = lastMessage?.user?.userName;
                    if (username === ownUserName) scrollToBottom();
                }
            } else {
                if (isScrolledToBottom(container)) {
                    scrollToBottom();
                }
            }
        }, 300);

        return () => clearTimeout(timer); // Очистка таймера
    }, [chatOnPage?.message]);
};
