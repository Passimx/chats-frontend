import { FC, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { useParams } from 'react-router-dom';
import { PropsType } from './types/props.type.ts';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { Avatar } from '../avatar';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { useGetChatTitle } from '../../common/hooks/use-get-chat-title.hook.ts';

const ChatItem: FC<PropsType> = ({ chat }) => {
    const navigate = useCustomNavigate();
    const { id } = useParams();
    const elementId = useMemo(() => `chat-${chat.id}`, [chat.id]);
    const title = useGetChatTitle(chat);

    useEffect(() => {
        const element = document.getElementById(elementId)!;
        const func = (event: MouseEvent) => {
            event.preventDefault();
        };
        element.addEventListener('contextmenu', func);

        return () => element.removeEventListener('contextmenu', func);
    }, []);

    return (
        <div
            id={elementId}
            className={`${styles.chat_item} ${id === `${chat.id}` && styles.selected_chat}`}
            onClick={() => {
                document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
                navigate(`${chat.name}`, { state: chat });
            }}
        >
            <div className={styles.avatar_background}>
                <Avatar showIcon={[ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chat.type)} />
            </div>
            <div className={styles.main_inf}>
                <div className={styles.title_block}>
                    <div className={`${styles.title} text_translate`}>{title}</div>
                </div>
                <div className={styles.count_message_block}>
                    {!!chat.countMessages && <div className={styles.count_message}>{chat.countMessages}</div>}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
