import { RefObject, useEffect, useRef } from 'react';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
import { useAppAction, useAppSelector } from '../../root/store';
import { getRawChat } from '../../root/store/raw/chats.raw.ts';

export const useReadMessage = (number: number): [RefObject<HTMLDivElement>] => {
    const observerTarget = useRef<HTMLDivElement>(null);
    const chatId = useAppSelector((state) => state.chats.chatOnPage?.id);

    const { postMessageToBroadCastChannel } = useAppAction();

    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                const chat = getRawChat(chatId);

                if (entry.isIntersecting && chatId && chat?.readMessage !== undefined && chat?.readMessage < number)
                    postMessageToBroadCastChannel({
                        event: EventsEnum.READ_MESSAGE,
                        data: { id: chatId, readMessage: number },
                    });
            },
            { threshold: 0.001 },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [chatId]);

    return [observerTarget];
};
