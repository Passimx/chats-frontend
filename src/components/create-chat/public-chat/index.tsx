import CreateChat from '../create-chat.tsx';
import { FC, useMemo } from 'react';
import styles from '../index.module.css';
import { RxLockOpen1 } from 'react-icons/rx';

const PublicChat: FC = () => {
    const [title] = useMemo(() => {
        return ['create_public_chat'];
    }, []);

    return <CreateChat title={title} icon={<RxLockOpen1 className={styles.title_icon} color={'green'} />} />;
};

export default PublicChat;
