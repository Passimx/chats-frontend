import { FC, useEffect, useState } from 'react';
import styles from './index.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import ChatAvatar from '../chat-avatar';
import { ChatType } from '../../root/types/chat/chat.type.ts';
import { useTranslation } from 'react-i18next';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import moment from 'moment/min/moment-with-locales';

const ChatItem: FC<{ chat: ChatType }> = ({ chat }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>();
    const [time, setTime] = useState<string>();
    const { id } = useParams();

    const updateTime = (data: Date) => {
        const now = new Date();
        const correctData = new Date(data);

        const diffAtDays = (now.getTime() - correctData.getTime()) / (1000 * 60 * 60 * 24);

        if (diffAtDays < 1) setTime(moment(correctData).format('LT'));
        else if (diffAtDays >= 1 && diffAtDays < 7) setTime(moment(correctData).format('dddd'));
        else setTime(moment(correctData).calendar());
    };

    useEffect(() => {
        if (chat.type === ChatEnum.IS_OPEN) {
            const message = chat.messages[0];
            const visibleMessage = message.type === MessageTypeEnum.IS_SYSTEM ? t('chat_is_create') : message.message;

            setMessage(visibleMessage);
            updateTime(message.createdAt);
        }
    }, [chat]);

    return (
        <div
            className={`${styles.chat_item} ${id === `${chat.id}` && styles.selected_chat}`}
            onClick={() => {
                document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
                navigate(`${chat.id}`, { state: chat });
            }}
        >
            <ChatAvatar type={chat.type} />
            <div className={styles.main_inf}>
                <div className={styles.title_block}>
                    <div className={styles.title}>{chat.title}</div>
                    <div className={styles.time}>{time}</div>
                </div>
                <div className={styles.message_block}>
                    <div className={styles.message}>{message}</div>
                    <div className={styles.count_message}>{chat.countMessages}</div>
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
