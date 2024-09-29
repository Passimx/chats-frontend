import { FC, useState } from 'react';
import ChatItem from '../../components/chat-item';
import styles from './index.module.css';
import useChats from './hooks/use-chats.ts';
import Search from '../search';

const Chats: FC = () => {
    const [input, setInput] = useState<string>();
    const [isLoading, chats] = useChats(input);

    if (chats)
        return (
            <div id={styles.background}>
                <Search isLoading={isLoading} onChange={setInput} />
                <div id={styles.chats}>
                    {chats.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        );
};
export default Chats;
