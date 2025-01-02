import { FC, useEffect } from 'react';
import styles from './index.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import ChatAvatar from '../chat-avatar';
import { ChatType } from '../../root/types/chat/chat.type.ts';
import { HiTrendingUp } from 'react-icons/hi';
import { FaUsers } from 'react-icons/fa';

const ChatItem: FC<{ chat: ChatType }> = ({ chat }) => {
    const navigate = useNavigate();
    const { id } = useParams();
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
                </div>
                <div className={styles.chat_block}>
                    <div className={styles.icon_block}>
                        <HiTrendingUp className={styles.icon} />
                        <div className={styles.count_max}>{32}</div>
                    </div>
                    <div></div>
                    <div className={styles.icon_block}>
                        <FaUsers className={styles.icon} />
                        <div className={styles.count_online}>{23}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
