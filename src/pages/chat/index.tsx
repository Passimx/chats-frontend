import useGetChat from './hooks/use-get-chat.hook.ts';
import styles from './index.module.css';
import { MouseEvent, useEffect, useState } from 'react';
import ChatAvatar from '../../components/chat-avatar';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import InputMessage from '../../components/input-message';
import Message from '../../components/message';
import { useTranslation } from 'react-i18next';
import rawChats from '../../root/store/chats/chats.raw.ts';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
import { useAppAction } from '../../root/store';

const Chat = () => {
    const { t } = useTranslation();
    const [chat] = useGetChat();
    const [chatIsExist, setChatIsExist] = useState<boolean>();
    const [chatAdded, setChatAdded] = useState<boolean>();
    const { postMessage } = useAppAction();

    useEffect(() => {
        if (!chat) return;
        setChatAdded(false);
        setChatIsExist(!!rawChats.chats.get(chat.id));
    }, [chat]);

    const addChat = () => {
        if (!chat) return;
        setChatAdded(true);
        postMessage({ data: { event: EventsEnum.CREATE_CHAT, data: { success: true, data: chat } } });
    };

    const back = (e: MouseEvent<unknown>) => {
        e.stopPropagation();
        document.documentElement.style.setProperty('--menu-margin', '0px');
    };

    if (!chat) return <></>;

    return (
        <div id={styles.background}>
            <div id={styles.main}>
                <div id={styles.header}>
                    <IoArrowBackCircleOutline onClick={back} id={styles.back_icon} />
                    <div id={styles.chat_inf}>
                        <ChatAvatar type={chat.type} />
                        <div>{chat.title}</div>
                    </div>
                </div>
                {!chatIsExist && (
                    <div className={`${styles.add_chat_block} ${chatAdded && styles.chat_added}`} onClick={addChat}>
                        <IoIosAddCircleOutline id={styles.new_chat_icon} />
                        {t('add_chat')}
                    </div>
                )}
            </div>
            <div id={styles.messages_main_block}>
                <div id={styles.messages_block}>
                    <div id={styles.messages}>
                        {chat.messages.map(
                            ({ id, message, type, createdAt, number }) =>
                                message && (
                                    <Message
                                        key={id}
                                        chatId={chat.id}
                                        title={chat.title}
                                        number={number}
                                        message={message}
                                        type={type}
                                        createdAt={new Date(createdAt)}
                                    />
                                ),
                        )}
                        <div></div>
                    </div>
                </div>
                <InputMessage />
            </div>
        </div>
    );
};

export default Chat;
