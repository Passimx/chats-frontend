import { ChatItemIndexDb } from '../../../root/types/chat/chat.type.ts';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment/min/moment-with-locales';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../root/store';
import { getVisibleMessage } from './use-visible-message.hook.ts';
import { usePinned } from '../../../common/hooks/use-pinned.hook.ts';

type ReturnType = [string | undefined, string | undefined, string | undefined, boolean];

export const useMessage = (chat: ChatItemIndexDb): ReturnType => {
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { t } = useTranslation();
    const [message, setMessage] = useState<string>(chat.message?.message ?? '');
    const [countMessages, setCountMessages] = useState<string>();
    const [time, setTime] = useState<string>();
    const isPinned = usePinned(chat.message?.id, chat.pinnedMessages);

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
        if (!message) return;
        const visibleMessage: string = getVisibleMessage(message, t);

        updateTime(message.createdAt);
        setMessage(visibleMessage);
    }, [chat.message]);

    const changeCountMessages = useCallback(() => {
        if (!isLoadedChatsFromIndexDb) return;

        const count = chat.countMessages;
        const number = chat.readMessage;
        const difference = count - number;

        if (!difference) setCountMessages(undefined);
        else if (difference < 1000) setCountMessages(difference.toString());
        else if (difference < 1000000) setCountMessages(`${Math.floor(difference / 1000)}К`);
        else if (difference >= 1000000) setCountMessages(`${Math.floor(difference / 1000000)}М`);
    }, [chat]);

    useEffect(() => {
        changeMessage();
    }, [chat.message?.id, t]);

    useEffect(() => {
        changeCountMessages();
    }, [chat.countMessages - chat.readMessage]);

    return [message, time, countMessages, isPinned];
};
