import { FC, useState } from 'react';
import styles from './index.module.css';
import styles2 from '../../components/chat-item/index.module.css';
import Search from '../search';
import { useAppSelector } from '../../root/store';
import BackButton from '../../components/back-button';
import { SearchGlobalChats } from '../search-global-chats';
import LoadingChats from '../../components/loading-chats';
import Loading from '../../components/loading';
import ChatItem from '../../components/chat-item';
import rawChats from '../../root/store/chats/chats.raw.ts';
import { ChatType } from '../../root/types/chat/chat.type.ts';

const Chats: FC = () => {
    const [input, setInput] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const page = useAppSelector((state) => state.app.page);
    const { chats, updatedChats } = useAppSelector((state) => state.chats);

    const filterFunc = ({ title }: ChatType): boolean => {
        if (!input?.length) return true;
        const searchWords = input.split(' ');
        const titleWords = title.split(' ');

        return !searchWords.filter(
            (word) => !titleWords.find((title) => title.toLowerCase().indexOf(word.toLowerCase()) === 0),
        ).length;
    };

    return (
        <div id={styles.background}>
            <div id={styles.main}>
                <Search isLoading={isLoading} onChange={setInput} />
                <div id={styles.chats}>
                    <Loading isLoading={isLoading} loadingComponent={<LoadingChats />}>
                        {updatedChats.filter(filterFunc).map((chat) => (
                            <ChatItem key={chat.id} chat={chat} isNew={true} />
                        ))}
                        {chats
                            .filter(filterFunc)
                            .map((chat, index) =>
                                rawChats.updatedChats.get(chat.id) ? (
                                    <div key={index} className={`${styles2.chat_item} ${styles2.hide_chat}`}></div>
                                ) : (
                                    <ChatItem key={chat.id} chat={chat} />
                                ),
                            )}
                        <SearchGlobalChats input={input} changeIsLoading={setIsLoading} />
                    </Loading>
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
};
export default Chats;
