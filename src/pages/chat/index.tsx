import useGetChat from './hooks/use-get-chat.hook.ts';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { MouseEvent, useEffect } from 'react';
import ChatAvatar from '../../components/chat-avatar';
import { IoArrowBackCircleOutline } from 'react-icons/io5';

const Chat = () => {
    const navigate = useNavigate();

    const [isLoading, chat] = useGetChat();

    useEffect(() => {
        if (!chat && !isLoading) navigate('/');
    }, [isLoading, chat]);

    if (!chat) return <></>;

    const back = (e: MouseEvent<unknown>) => {
        e.stopPropagation();
        document.documentElement.style.setProperty('--menu-margin', '0px');
    };

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
                <div></div>
            </div>
            <div id={styles.write_message}>
                <div id={styles.write_message_block}>123</div>
            </div>
        </div>
    );
};

export default Chat;
