import { useEffect } from 'react';
import { UseAutoScrollProps } from '../props.type';
import { useAppSelector } from '../../../root/store';

export const useAutoScroll = (props: UseAutoScrollProps) => {
    const { chatOnPage } = useAppSelector((state) => state.chats);

    const scrollToBottom = () => {
        if (!chatOnPage?.id) return;
        const container = props.chatContainerRef.current;
        if (container) {
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
        }
    };

    const isScrolledToBottom = (element: HTMLDivElement) => {
        const { scrollTop, scrollHeight, clientHeight } = element;
        const threshold = 100;
        return Math.abs(scrollHeight - scrollTop - clientHeight) < threshold;
    };

    useEffect(() => {
        if (!chatOnPage?.messages) return;

        const timer = setTimeout(() => {
            if (props.isShowLastMessagesButton) {
                const isNewMessage = chatOnPage.countMessages > chatOnPage.readMessage;
                if (isNewMessage) {
                    const lastMessage = chatOnPage.messages[chatOnPage.messages.length - 1];
                    const username = lastMessage?.user?.userName;
                    console.log(username, props.ownUserName);
                    if (username === props.ownUserName) scrollToBottom();
                }
            } else {
                if (isScrolledToBottom(props.chatContainerRef.current as HTMLDivElement)) {
                    scrollToBottom();
                }
            }
        }, 300);

        return () => clearTimeout(timer); // Очистка таймера
    }, [chatOnPage?.message]);
};
