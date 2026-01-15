import { RefObject, useEffect, useRef } from 'react';
import { useAppSelector } from '../../root/store';
import { getRawChat } from '../../root/store/raw/chats.raw.ts';
import { readMessage } from '../../root/api/chats';

export const useReadMessage = (number: number): [RefObject<HTMLDivElement>] => {
    const observerTarget = useRef<HTMLDivElement>(null);
    const chatId = useAppSelector((state) => state.chats.chatOnPage?.id);

    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                const entry = entries[0];
                const chat = getRawChat(chatId);

                if (entry.isIntersecting && chatId && chat?.readMessage !== undefined && chat?.readMessage < number)
                    await readMessage(chatId, { number });
            },
            { threshold: 0.001 },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [chatId]);

    return [observerTarget];
};
