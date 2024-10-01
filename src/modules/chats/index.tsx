import { FC, useState } from 'react';
import ChatItem from '../../components/chat-item';
import styles from './index.module.css';
import useChats from './hooks/use-chats.ts';
import Search from '../search';
import { useAppSelector } from '../../root/store';
import useSetPage from '../../root/store/app/hooks/use-set-page.ts';

const Chats: FC = () => {
    const [input, setInput] = useState<string>();
    const [isLoading, chats] = useChats(input);
    const page = useAppSelector((state) => state.app.page);
    const setPage = useSetPage();

    if (chats)
        return (
            <div id={styles.background}>
                <div id={styles.main}>
                    <Search isLoading={isLoading} onChange={setInput} />
                    <div id={styles.chats}>
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                        {chats.map((chat) => (
                            <ChatItem key={chat.id} chat={chat} />
                        ))}
                    </div>
                </div>
                <div id={styles.page}>
                    <div onClick={() => setPage(null)}>Назад</div>
                    {page}
                </div>
            </div>
        );
};
export default Chats;
