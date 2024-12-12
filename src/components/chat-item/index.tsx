import { FC, useEffect } from 'react';
import styles from './index.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import ChatAvatar from '../chat-avatar';
import { ChatType } from '../../root/types/chat/chat.type.ts';
import { useMessage } from './hooks/use-message.hook.ts';

const ChatItem: FC<{ chat: ChatType; isNew?: boolean }> = ({ chat, isNew = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, countMessages, time] = useMessage(chat);
    const elementId = `chat-${chat.id}`;

    useEffect(() => {
        const element = document.getElementById(elementId)!;
        element.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }, []);

    return (
        <div
            id={elementId}
            className={`${styles.chat_item} ${id === `${chat.id}` && styles.selected_chat} ${isNew && styles.new_message}`}
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
                    <div className={styles.count_message}>{countMessages}</div>
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
