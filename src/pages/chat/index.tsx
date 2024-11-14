import useGetChat from './hooks/use-get-chat.hook.ts';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { MouseEvent, useEffect } from 'react';
import ChatAvatar from '../../components/chat-avatar';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import InputMessage from '../../components/input-message';
import Message from '../../components/message';

const messages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 61, 17, 181, 19, 20, 21, 22, 23, 24, 25];

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
                        {messages.map((num) => (
                            <Message key={num} message={String(num)} createdAt={new Date()} />
                        ))}
                    </div>
                </div>
                <InputMessage />
            </div>
        </div>
    );
};

export default Chat;
