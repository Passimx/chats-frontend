import { FC, memo, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import ChatAvatar from '../chat-avatar';
import { useMessage } from './hooks/use-message.hook.ts';
import { IconEnum } from '../chat-avatar/types/icon.enum.ts';
import { PropsType } from './types/props.type.ts';
import { useTranslation } from 'react-i18next';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { FaStar } from 'react-icons/fa';

const ChatItem: FC<PropsType> = memo(({ chat, isNew = false, isChatOnPage, redirect }) => {
    const { t } = useTranslation();
    const elementId = useMemo(() => `chat-${chat.id}`, [chat.id]);
    const [message, time, countMessages] = useMessage(chat);

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
            className={`${styles.chat_item} ${isChatOnPage && styles.selected_chat} ${isNew && styles.new_message}`}
            onClick={() => redirect(chat.id, chat)}
        >
            <ChatAvatar
                onlineCount={chat.online}
                maxUsersOnline={chat.maxUsersOnline}
                iconType={IconEnum.ONLINE}
                isSystem={chat.type === ChatEnum.IS_SYSTEM}
            />
            <div className={styles.main_inf}>
                <div className={styles.title_block}>
                    <div>{chat.type === ChatEnum.IS_SYSTEM && <FaStar className={styles.icon_star} />}</div>
                    <div className={styles.title}>{chat.title}</div>
                    <div className={styles.time}>{time}</div>
                </div>
                <div className={styles.message_block}>
                    <div className={styles.message}>
                        {chat.inputMessage ? (
                            <>
                                <strong>📝{t('draft')}: </strong>
                                <span>{chat.inputMessage}</span>
                            </>
                        ) : (
                            <span>{message}</span>
                        )}
                    </div>
                    {countMessages && <div className={styles.count_message}>{countMessages}</div>}
                </div>
            </div>
        </div>
    );
});
export default ChatItem;
