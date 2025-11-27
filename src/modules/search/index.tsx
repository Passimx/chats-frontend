import SearchInput from '../../components/search-input';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import { IoIosAddCircleOutline, IoMdInformationCircleOutline } from 'react-icons/io';
import { LiaEyeSolid } from 'react-icons/lia';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import { useAppAction, useAppSelector } from '../../root/store';
import { PropsType } from './props.type.ts';
import SharedChatInfo from '../../components/chat-info/shared-chat-info';
import PublicChatInfo from '../../components/chat-info/public-chat-info';
import PrivateChatInfo from '../../components/chat-info/private-chat-info';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import SharedChat from '../../components/create-chat/shared-chat';
import PublicChat from '../../components/create-chat/public-chat';
import PrivateChat from '../../components/create-chat/private-chat';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { ScanQrCode } from '../../components/scan-qr-code';

const Search: FC<PropsType> = ({ isLoading, onChange }) => {
    const { t } = useTranslation();
    const [input, setInput] = useState<string>();
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();
    const { aesKey } = useAppSelector((state) => state.user);
    const { activeTab } = useAppSelector((state) => state.app);
    const { setStateApp } = useAppAction();
    const { pages } = useAppSelector((state) => state.app);

    const changePage = useCallback(
        (page: JSX.Element) => {
            setIsVisible(false);
            const newPages = new Map(pages);
            newPages.set(activeTab, [page]);
            setStateApp({ pages: newPages });
        },
        [activeTab, pages],
    );

    useEffect(() => {
        let value = input;
        if (value?.startsWith('@')) value = value?.slice(1);

        if (value?.length)
            try {
                const url = new URL(value);
                value = value.replace(url.origin, '');
                if (value.startsWith('/')) value = value?.slice(1);
            } catch (error) {
                value;
            }

        onChange(value);
    }, [input]);

    return (
        <div id={styles.search}>
            <SearchInput onChange={setInput} value={input} isLoading={isLoading} placeholder={t('search')} />
            <IoIosAddCircleOutline
                className={setVisibilityCss(styles.show_cancel, styles.show_add, isVisible)}
                id={styles.new_chat_icon}
                onClick={() => setIsVisible(true)}
            />
            <div
                id={styles.new_chats}
                ref={wrapperRef}
                className={setVisibilityCss(styles.show_slowly, styles.hide_slowly, isVisible)}
            >
                <div className={styles.new_chats_item}>
                    <div
                        className={styles.new_chats_item_click}
                        onClick={() => {
                            setIsVisible(false);
                            setStateApp({ page: <ScanQrCode /> });
                        }}
                    >
                        <MdOutlineQrCodeScanner className={styles.new_chats_item_logo} color="var(--menu-color)" />
                        <div className={'text_translate'}>{t('scan_qr_code')}</div>
                    </div>
                </div>
                // todo
                {/*<div className={styles.new_chats_item}>*/}
                {/*    <div className={styles.new_chats_item_click} onClick={() => changePage(<OpenChat />)}>*/}
                {/*        <AiOutlineGlobal className={styles.new_chats_item_logo} color="green" />*/}
                {/*        <div className={'text_translate'}>{t('create_open_chat')}</div>*/}
                {/*    </div>*/}
                {/*    <IoMdInformationCircleOutline*/}
                {/*        className={styles.new_chats_item_info}*/}
                {/*        onClick={() => changePage(<OpenChatInfo />)}*/}
                {/*    />*/}
                {/*</div>*/}
                {aesKey && (
                    <>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click} onClick={() => changePage(<SharedChat />)}>
                                <LiaEyeSolid className={styles.new_chats_item_logo} color="green" />
                                <div className={'text_translate'}>{t('create_shared_chat')}</div>
                            </div>
                            <IoMdInformationCircleOutline
                                className={styles.new_chats_item_info}
                                onClick={() => changePage(<SharedChatInfo />)}
                            />
                        </div>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click} onClick={() => changePage(<PublicChat />)}>
                                <RxLockOpen1 className={styles.new_chats_item_logo} color="green" />
                                <div className={'text_translate'}>{t('create_public_chat')}</div>
                            </div>
                            <IoMdInformationCircleOutline
                                className={styles.new_chats_item_info}
                                onClick={() => changePage(<PublicChatInfo />)}
                            />
                        </div>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click} onClick={() => changePage(<PrivateChat />)}>
                                <RxLockClosed className={styles.new_chats_item_logo} color="red" />
                                <div className={'text_translate'}>{t('create_private_chat')}</div>
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
