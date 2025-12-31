import { useMemo } from 'react';
import { PropsType } from '../types/props.type.ts';
import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import { ChatEnum } from '../../../root/types/chat/chat.enum.ts';
import { useAppSelector } from '../../../root/store';
import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';

export const useText = (props: PropsType | undefined) => {
    const { t } = useTranslation();
    const title = useAppSelector((state) => state.chats.chatOnPage?.title);
    const chatType = useAppSelector((state) => state.chats.chatOnPage?.type);
    return useMemo(() => {
        if (!props) return [];
        const time = moment(props.createdAt).format('LT');
        let message;
        if (props.type === MessageTypeEnum.IS_CREATED_CHAT) {
            message = `${t(props.message)} «${title}»`;
            if (chatType && [ChatEnum.IS_FAVORITES, ChatEnum.IS_DIALOGUE].includes(chatType))
                message = t(props.message);
        } else if (props.type === MessageTypeEnum.IS_SYSTEM) message = t(props.message);
        else message = props.message;

        return [message, time];
    }, [t, props, title, chatType]);
};
