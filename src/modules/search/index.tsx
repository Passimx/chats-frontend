import SearchInput from '../../components/search-input';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import { IoIosAddCircleOutline, IoMdInformationCircleOutline } from 'react-icons/io';
import { AiOutlineGlobal } from 'react-icons/ai';
import { LiaEyeSolid } from 'react-icons/lia';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import { useAppSelector } from '../../root/store';
import { PropsType } from './props.type.ts';
import OpenChatInfo from '../../components/chat-info/open-chat-info';
import useSetPageHook from '../../root/store/app/hooks/use-set-page.hook.ts';
import SharedChatInfo from '../../components/chat-info/shared-chat-info';
import PublicChatInfo from '../../components/chat-info/public-chat-info';
import PrivateChatInfo from '../../components/chat-info/private-chat-info';
import useVisibility from '../../common/hooks/use-visibility.ts';
import OpenChat from '../../components/create-chat/open-chat';
import SharedChat from '../../components/create-chat/shared-chat';
import PublicChat from '../../components/create-chat/public-chat';
import PrivateChat from '../../components/create-chat/private-chat';

const Search: FC<PropsType> = ({ isLoading, onChange }) => {
    const { t } = useTranslation();
    const [input, setInput] = useState<string>();
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();
    const { aesKey } = useAppSelector((state) => state.user);
    const setPage = useSetPageHook();

    useEffect(() => {
        onChange(input);
    }, [input]);

    const changePage = (page: JSX.Element) => {
        setIsVisible(false);
        setPage(page);
    };

    return (
        <div id={styles.search}>
            <SearchInput onChange={setInput} value={input} isLoading={isLoading} placeholder={t('search')} />
            <IoIosAddCircleOutline
                className={useVisibility(styles.show_cancel, styles.show_add, isVisible)}
                id={styles.new_chat_icon}
                onClick={() => setIsVisible(true)}
            />
            <div
                id={styles.new_chats}
                ref={wrapperRef}
                className={useVisibility(styles.show_slowly, styles.hide_slowly, isVisible)}
            >
                <div className={styles.new_chats_item}>
                    <div className={styles.new_chats_item_click} onClick={() => changePage(<OpenChat />)}>
                        <AiOutlineGlobal className={styles.new_chats_item_logo} color="green" />
                        <div>{t('create_open_chat')}</div>
                    </div>
                    <IoMdInformationCircleOutline
                        className={styles.new_chats_item_info}
                        onClick={() => changePage(<OpenChatInfo />)}
                    />
                </div>
                {aesKey && (
                    <>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click} onClick={() => changePage(<SharedChat />)}>
                                <LiaEyeSolid className={styles.new_chats_item_logo} color="green" />
                                <div>{t('create_shared_chat')}</div>
                            </div>
                            <IoMdInformationCircleOutline
                                className={styles.new_chats_item_info}
                                onClick={() => changePage(<SharedChatInfo />)}
                            />
                        </div>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click} onClick={() => changePage(<PublicChat />)}>
                                <RxLockOpen1 className={styles.new_chats_item_logo} color="green" />
                                <div>{t('create_public_chat')}</div>
                            </div>
                            <IoMdInformationCircleOutline
                                className={styles.new_chats_item_info}
                                onClick={() => changePage(<PublicChatInfo />)}
                            />
                        </div>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click} onClick={() => changePage(<PrivateChat />)}>
                                <RxLockClosed className={styles.new_chats_item_logo} color="red" />
                                <div>{t('create_private_chat')}</div>
                            </div>
                            <IoMdInformationCircleOutline
                                className={styles.new_chats_item_info}
                                onClick={() => changePage(<PrivateChatInfo />)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;
