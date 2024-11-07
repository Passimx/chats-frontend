import useGetChat from './hooks/use-get-chat.hook.ts';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { useEffect } from 'react';

const Chat = () => {
    const navigate = useNavigate();

    const [isLoading, chat] = useGetChat();

    useEffect(() => {
        if (!chat && !isLoading) navigate('/');
    }, [isLoading, chat]);

    if (!chat) return <></>;

    return <div id={styles.background}>{chat.id}</div>;
};

export default Chat;
