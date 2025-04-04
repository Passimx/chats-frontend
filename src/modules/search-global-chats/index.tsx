import { FC } from 'react';
import useChats from './hooks/use-chats.ts';
import styles from './index.module.css';
import VisibilityAction from '../../components/visibility-action';
import { useTranslation } from 'react-i18next';
import styles2 from '../../components/chat-item/index.module.css';
import rawChats, { getRawChat } from '../../root/store/chats/chats.raw.ts';
import SearchChatItem from '../../components/search-chat-item';
import { PropsType } from './types/props.type.ts';
import BigText from '../../components/big-text';
import Loading from '../../components/loading';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoSearch } from 'react-icons/io5';

export const SearchGlobalChats: FC<PropsType> = ({ input, changeIsLoading }) => {
    const { t } = useTranslation();
    const [chats, isLoading, scrollBottom] = useChats(input, changeIsLoading);

    if (!input?.length) return <></>;

    return (
        <>
            <div className={styles.nav_chats}>
                {isLoading ? (
                    <AiOutlineLoading3Quarters id={styles.loading_logo} className={styles.logo} />
                ) : (
                    <IoSearch id={styles.search_logo} className={styles.logo} />
                )}
                <div>{t('global_search')}</div>
            </div>
            <Loading isLoading={isLoading} loadingComponent={<BigText text="" />}>
                {chats.length ? (
                    chats.map((chat, index) =>
                        rawChats.updatedChats.get(chat.id) ? (
                            <div key={index} className={`${styles2.chat_item} ${styles2.hide_chat}`}></div>
                        ) : (
                            !getRawChat(chat.id) && <SearchChatItem key={chat.id} chat={chat} />
                        ),
                    )
                ) : (
                    <BigText text={t('no_chats')} />
                )}
                <VisibilityAction action={scrollBottom} size={chats.length} loading={isLoading} />
                <div className={styles.nav_padding}></div>
            </Loading>
        </>
    );
};
