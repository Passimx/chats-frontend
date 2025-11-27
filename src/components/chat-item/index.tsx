import { FC, memo, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { useMessage } from './hooks/use-message.hook.ts';
import { PropsType } from './types/props.type.ts';
import { useTranslation } from 'react-i18next';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { FaStar } from 'react-icons/fa';
import { BsPinAngleFill } from 'react-icons/bs';
import { useGetChatTitle } from '../../common/hooks/use-get-chat-title.hook.ts';
import { Avatar } from '../avatar';

const ChatItem: FC<PropsType> = memo(({ chat, isNew = false, isChatOnPage, redirect }) => {
    const { t } = useTranslation();
    const title = useGetChatTitle(chat);
    const elementId = useMemo(() => `chat-${chat.id}`, [chat.id]);
    const [message, time, countMessages, isPinned] = useMessage(chat);

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
            onClick={() => redirect(chat.name, chat)}
        >
            <div className={styles.avatar_background}>
                <Avatar showIcon={[ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chat.type)} />
            </div>

            <div className={styles.main_inf}>
                <div className={styles.title_block}>
                    <div>
                        {[ChatEnum.IS_FAVORITES, ChatEnum.IS_SYSTEM].includes(chat.type) && (
                            <FaStar className={styles.icon_star} />
                        )}
                    </div>
                    <div className={`${styles.title} text_translate`}>{title}</div>
                    <div className={`${styles.time} text_translate`}>
                        {isPinned && <BsPinAngleFill className={styles.pin} />}
                        <div className={styles.time_text}>{time}</div>
                    </div>
                </div>
                <div className={styles.message_block}>
                    <div className={`${styles.message} text_translate`}>
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
            <div className={styles.border}></div>
        </div>
    );
});
export default ChatItem;
