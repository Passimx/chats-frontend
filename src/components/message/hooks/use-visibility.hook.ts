import { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { useAppSelector } from '../../../root/store';
import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import { PropsType } from '../types/props.type.ts';
import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';

export const useVisibility = (props: PropsType): [MutableRefObject<null>, string, string] => {
    const { number, message, type, createdAt, chatId, readMessage } = props;
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const observerTarget = useRef(null);
    const { t } = useTranslation();
    const time = moment(createdAt).format('LT');

    const visibleMessage = useMemo(() => {
        if (type === MessageTypeEnum.IS_CREATED_CHAT) return `${t(message)} «${chatOnPage?.title}»`;
        if (type === MessageTypeEnum.IS_SYSTEM) return t(message);
        return message;
    }, [t]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && chatOnPage) readMessage(chatId, number);
            },
            {
                threshold: 0.001,
            },
        );

        if (observerTarget.current) observer.observe(observerTarget.current);

        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [chatOnPage, readMessage]);

    return [observerTarget, visibleMessage, time];
};
