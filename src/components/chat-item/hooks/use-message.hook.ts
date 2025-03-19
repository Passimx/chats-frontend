import { ChatItemIndexDb } from '../../../root/types/chat/chat.type.ts';
import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment/min/moment-with-locales';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../root/store';

export const useMessage = (chat: ChatItemIndexDb): (string | undefined)[] => {
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { t } = useTranslation();
    const [message, setMessage] = useState<string>();
    const [countMessages, setCountMessages] = useState<string>();
    const [time, setTime] = useState<string>();

    const updateTime = useCallback((data: Date) => {
        const now = new Date();
        const correctData = new Date(data);

        const diffAtDays = (now.getTime() - correctData.getTime()) / (1000 * 60 * 60 * 24);

        if (diffAtDays < 1) setTime(moment(correctData).format('LT'));
        else if (diffAtDays >= 1 && diffAtDays < 7) setTime(moment(correctData).format('dddd'));
        else setTime(moment(correctData).calendar());
    }, []);

    const changeMessage = useCallback(() => {
        const message = chat.message;
        let visibleMessage: string = '';

        if (message.type === MessageTypeEnum.IS_USER) visibleMessage = message.message;
        else visibleMessage = t(message.message);

        setMessage(visibleMessage);
        updateTime(message.createdAt);
    }, []);

    const changeCountMessages = useCallback(() => {
        if (!isLoadedChatsFromIndexDb) return;

        const count = chat.countMessages;
        const number = chat.readMessage;
        const difference = count - number;

        if (!difference) setCountMessages(undefined);
        else if (difference < 1000) setCountMessages(difference.toString());
        else if (difference < 1000000) setCountMessages(`${Math.floor(difference / 1000)}К`);
        else if (difference >= 1000000) setCountMessages(`${Math.floor(difference / 1000000)}М`);
    }, []);

    useEffect(() => {
        changeMessage();
    }, [chat]);

    useEffect(() => {
        changeCountMessages();
    }, [chat]);

    return [message, time, countMessages];
};
