import CreateChat from '../create-chat.tsx';
import { FC, useMemo } from 'react';
import styles from '../index.module.css';
import { AiOutlineGlobal } from 'react-icons/ai';

const OpenChat: FC = () => {
    const [title] = useMemo(() => {
        return ['create_open_chat'];
    }, []);

    return <CreateChat title={title} icon={<AiOutlineGlobal className={styles.title_icon} color={'green'} />} />;
};

export default OpenChat;
