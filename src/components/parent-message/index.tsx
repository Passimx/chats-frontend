import { FC, useCallback } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { getVisibleMessage } from '../chat-item/hooks/use-visible-message.hook.ts';
import { useTranslation } from 'react-i18next';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { getChatById } from '../../root/api/chats';
import { useAppAction } from '../../root/store';
import { EventsEnum } from '../../root/types/events/events.enum.ts';

export const ParentMessage: FC<PropsType> = (props) => {
    const { t } = useTranslation();
    const { postMessageToBroadCastChannel } = useAppAction();

    const message = getVisibleMessage(props, t);

    const navigate = useCustomNavigate();

    const click = useCallback(async () => {
        const chat = await getChatById(props.chatId);
        if (!chat) return postMessageToBroadCastChannel({ event: EventsEnum.SHOW_TEXT, data: 'no_chats' });

        navigate(`/${chat.name}?number=${props.number}`);
        const element = document.getElementById(`message-${props.number}`);
        if (element) element.scrollIntoView();
    }, []);

    return (
        <div onClick={click} className={styles.background}>
            {message}
        </div>
    );
};
