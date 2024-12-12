import { FC } from 'react';
import useChats from './hooks/use-chats.ts';
import styles from './index.module.css';
import ChatItem from '../../components/chat-item';
import ChatsNotFound from '../../components/chats-not-found';
import VisibilityAction from '../../components/visibility-action';
import { useTranslation } from 'react-i18next';
import styles2 from '../../components/chat-item/index.module.css';
import rawChats from '../../root/store/chats/chats.raw.ts';

export const SearchGlobalChats: FC<{ input: string | undefined; changeIsLoading: (value: boolean) => void }> = ({
    input,
    changeIsLoading,
}) => {
    const { t } = useTranslation();
    const [chats, isLoading, scrollBottom] = useChats(input, changeIsLoading);

    if (!input?.length) return <></>;

    return (
        <>
            <div className={styles.nav_chats}>{t('global_search')}</div>
            {chats.length ? (
                chats.map((chat, index) =>
                    rawChats.updatedChats.get(chat.id) ? (
                        <div key={index} className={`${styles2.chat_item} ${styles2.hide_chat}`}></div>
                    ) : (
                        !rawChats.chats.get(chat.id) && <ChatItem key={chat.id} chat={chat} />
                    ),
                )
            ) : (
                <ChatsNotFound />
            )}
            <VisibilityAction action={scrollBottom} size={chats.length} loading={isLoading} />
            <div className={styles.nav_padding}></div>
        </>
    );
};
