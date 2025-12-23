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
import { RxLockClosed } from 'react-icons/rx';

const ChatItem: FC<PropsType> = memo(({ chat, isNew = false, isChatOnPage, redirect }) => {
    const { t } = useTranslation();
    const title = useGetChatTitle(chat);
    const elementId = useMemo(() => `chat-${chat.id}`, [chat.id]);
    const [message, time, countMessages, isPinned] = useMessage(chat);

    const authorOfLastMessage = chat?.messages[chat.messages.length - 1]?.user?.name || 'System';

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
                    <div className={`${styles.title} text_translate`}>{`${title}\u00A0 `}</div>
                    <div>
                        {[ChatEnum.IS_SYSTEM].includes(chat.type) && <FaStar className={styles.icon_star} />}
                        {[ChatEnum.IS_FAVORITES].includes(chat.type) && (
                            <RxLockClosed className={styles.look_svg} color="red" />
                        )}
                    </div>

                    <div className={`${styles.time} text_translate`}>
                        {isPinned && <BsPinAngleFill className={styles.pin} />}
                        <div className={styles.time_text}>{time}</div>
                    </div>
                </div>
                <div className={styles.message_block}>
                    <div className={`${styles.message} text_translate`}>
                        {chat.inputMessage ? (
                            <>
                                <span>
                                    <strong>📝 {t('draft')}: </strong>
                                    {chat.inputMessage}
                                </span>
                            </>
                        ) : (
                            <span>{`${authorOfLastMessage}: ${message}`}</span>
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
