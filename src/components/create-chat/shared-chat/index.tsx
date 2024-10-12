import CreateChat from '../create-chat.tsx';
import { FC, useMemo } from 'react';
import styles from '../index.module.css';
import { LiaEyeSolid } from 'react-icons/lia';

const SharedChat: FC = () => {
    const [title] = useMemo(() => {
        return ['create_shared_chat'];
    }, []);

    return <CreateChat title={title} icon={<LiaEyeSolid className={styles.title_icon} color={'green'} />} />;
};

export default SharedChat;
