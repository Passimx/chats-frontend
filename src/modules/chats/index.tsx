import { FC, memo, useCallback, useMemo, useState } from 'react';
import styles from './index.module.css';
import styles2 from '../../components/chat-item/index.module.css';
import Search from '../search';
import { useAppSelector } from '../../root/store';
import BackButton from '../../components/back-button';
import { SearchGlobalChats } from '../search-global-chats';
import ChatItem from '../../components/chat-item';
import rawChats from '../../root/store/chats/chats.raw.ts';
import { ChatType } from '../../root/types/chat/chat.type.ts';
import { useNavigate } from 'react-router-dom';

const Chats: FC = memo(() => {
    const navigate = useNavigate();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [input, setInput] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const page = useAppSelector((state) => state.app.page);
    const { chats, updatedChats } = useAppSelector((state) => state.chats);

    const filterFunc = ({ title }: ChatType): boolean => {
        if (!input?.length) return true;
        const searchWords = input.split(' ');

        return (
            searchWords.filter((word) => ` ${title}`.toLowerCase().indexOf(` ${word}`.toLowerCase()) !== -1).length ===
            searchWords.length
        );
    };

    const filteredChats = useMemo(() => chats.filter(filterFunc), [input, chats, isLoading]);

    const redirect = useCallback((url: string, state: object) => {
        document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
        navigate(url, state);
    }, []);

    return (
        <div id={styles.background}>
            <div id={styles.main}>
                <Search isLoading={isLoading} onChange={setInput} />
                <div id={styles.chats}>
                    {updatedChats.filter(filterFunc).map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            isChatOnPage={chatOnPage?.id === chat.id}
                            isNew={true}
                            redirect={redirect}
                        />
                    ))}
                    {filteredChats.map((chat, index) =>
                        rawChats.updatedChats.get(chat.id) ? (
                            <div key={index} className={`${styles2.chat_item} ${styles2.hide_chat}`}></div>
                        ) : (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                isChatOnPage={chatOnPage?.id === chat.id}
                                redirect={redirect}
                            />
                        ),
                    )}
                    <SearchGlobalChats input={input} changeIsLoading={setIsLoading} />
                </div>
            </div>
            <div id={styles.page_block}>
                <div id={styles.page_button}>
                    <BackButton />
                </div>
                <div id={styles.page}>{page}</div>
            </div>
        </div>
    );
});
export default Chats;
