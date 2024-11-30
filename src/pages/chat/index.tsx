import useGetChat from './hooks/use-get-chat.hook.ts';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { MouseEvent, useEffect } from 'react';
import ChatAvatar from '../../components/chat-avatar';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import InputMessage from '../../components/input-message';
import Message from '../../components/message';

const Chat = () => {
    const navigate = useNavigate();
    const [isLoading, chat] = useGetChat();

    useEffect(() => {
        if (!chat && !isLoading) {
            document.documentElement.style.setProperty('--menu-margin', '0px');
            navigate('/');
        }

        if (chat && !isLoading) {
            document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
        }
    }, [isLoading, chat]);

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
            </div>
            <div id={styles.messages_main_block}>
                <div id={styles.messages_block}>
                    <div id={styles.messages}>
                        {chat.messages.map(
                            ({ id, message, type, createdAt }) =>
                                message && (
                                    <Message
                                        key={id}
                                        message={message}
                                        title={chat.title}
                                        type={type}
                                        createdAt={new Date(createdAt)}
                                    />
                                ),
                        )}
                    </div>
                </div>
                <InputMessage />
            </div>
        </div>
    );
};

export default Chat;
