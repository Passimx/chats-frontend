import CreateChat from '../create-chat.tsx';
import { FC, useMemo } from 'react';
import styles from '../index.module.css';
import { RxLockClosed } from 'react-icons/rx';

const PrivateChat: FC = () => {
    const [title] = useMemo(() => {
        return ['create_private_chat'];
    }, []);

    return <CreateChat title={title} icon={<RxLockClosed className={styles.title_icon} color={'red'} />} />;
};

export default PrivateChat;
