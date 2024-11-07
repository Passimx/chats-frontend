import { FC } from 'react';
import styles from './index.module.css';
import logo from '/logo2.png';
import { ChatItemType } from '../../root/types/chat/chat-item.type.ts';
import { AiOutlineGlobal } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { LiaEyeSolid } from 'react-icons/lia';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';

const ChatItem: FC<{ chat: ChatItemType }> = ({ chat }) => {
    const navigate = useNavigate();

    return (
        <div
            className={styles.chat_item}
            onClick={() => {
                navigate(`${chat.id}`, { state: chat });
            }}
        >
            <div>
                <img
                    className={`${styles.icon_avatar} ${styles.icon_public_or_private_chat}`}
                    src={logo}
                    alt={'icon'}
                />
                <div className={styles.look}>
                    {chat.type === ChatEnum.IS_OPEN && <AiOutlineGlobal className={styles.look_svg} color="green" />}
                    {chat.type === ChatEnum.IS_SHARED && <LiaEyeSolid className={styles.look_svg} color="green" />}
                    {chat.type === ChatEnum.IS_PUBLIC && <RxLockOpen1 className={styles.look_svg} color="green" />}
                    {chat.type === ChatEnum.IS_PRIVATE && <RxLockClosed className={styles.look_svg} color="red" />}
                </div>
            </div>
            <div className={styles.main_inf}>
                <div className={styles.title}>{chat.title}</div>
                <div className={styles.message_block}>
                    {/*<div className={styles.message}>{chat.lastMessage?.message}</div>*/}
                    {/*{chat.countIsNotReadMessages > 0 && (*/}
                    {/*    <div className={styles.count_message}>{chat.countIsNotReadMessages}</div>*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
