import { useEffect } from 'react';
import { UseAutoScrollProps } from '../props.type';
import { useAppSelector } from '../../../root/store';

export const useAutoScroll = (props: UseAutoScrollProps) => {
    const { chatOnPage } = useAppSelector((state) => state.chats);

    const scrollToBottom = () => {
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

    useEffect(() => {
        scrollToBottom();
    }, [chatOnPage?.inputMessage, chatOnPage?.messages]);
};
