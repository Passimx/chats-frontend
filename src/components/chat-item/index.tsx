import { FC } from 'react';
import styles from './index.module.css';
import logo from '/logo2.png';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';
import { LiaEyeSolid } from 'react-icons/lia';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { ChatItemType } from '../../root/types/chat/chat-item.type.ts';

const ChatItem: FC<{ chat: ChatItemType }> = ({ chat }) => {
    return (
        <div className={styles.chat_item}>
            <div>
                <img
                    className={`${styles.icon_avatar} ${chat.sort !== ChatEnum.IS_OPEN && styles.icon_public_or_private_chat}`}
                    src={logo}
                    alt={'icon'}
                />
                <div className={styles.look}>
                    {chat.sort === ChatEnum.IS_SHARED && <LiaEyeSolid size={15} color="green" />}
                    {chat.sort === ChatEnum.IS_PUBLIC && <RxLockOpen1 size={15} color="green" />}
                    {chat.sort === ChatEnum.IS_PRIVATE && <RxLockClosed size={15} color="red" />}
                </div>
            </div>
            <div className={styles.main_inf}>
                <div className={styles.title}>{chat.title}</div>
                <div className={styles.message_block}>
                    <div className={styles.message}>{chat.lastMessage?.message}</div>
                    {chat.countIsNotReadMessages > 0 && (
                        <div className={styles.count_message}>{chat.countIsNotReadMessages}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
