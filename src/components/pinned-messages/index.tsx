import { FC, memo } from 'react';
import styles from './index.module.css';
import { useAppSelector } from '../../root/store';

export const PinnedMessages: FC = memo(() => {
    const pinnedMessages = useAppSelector((state) => state.chats.chatOnPage?.pinnedMessages);

    if (pinnedMessages?.length) return <div className={styles.background}>Закрепленные сообщения</div>;
});
