import { FC, memo, useEffect } from 'react';
import styles from './index.module.css';
import ChatAvatar from '../chat-avatar';
import { useMessage } from './hooks/use-message.hook.ts';
import { IconEnum } from '../chat-avatar/types/icon.enum.ts';
import { PropsType } from './types/props.type.ts';
import { useTranslation } from 'react-i18next';

const ChatItem: FC<PropsType> = memo(({ chat, isNew = false, isChatOnPage, redirect }) => {
    const elementId = `chat-${chat.id}`;
    const { t } = useTranslation();
    const [message, time, countMessages] = useMessage(chat);

    useEffect(() => {
        const element = document.getElementById(elementId)!;
        element.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }, []);

    return (
        <div
            id={elementId}
            className={`${styles.chat_item} ${isChatOnPage && styles.selected_chat} ${isNew && styles.new_message}`}
            onClick={() => redirect(chat.id, chat)}
        >
            <ChatAvatar onlineCount={chat.online} maxUsersOnline={chat.maxUsersOnline} iconType={IconEnum.ONLINE} />
            <div className={styles.main_inf}>
                <div className={styles.title_block}>
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
