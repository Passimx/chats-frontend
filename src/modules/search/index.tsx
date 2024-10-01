import Input from '../../components/input';
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
import Info from '../../components/info';
import useSetPage from '../../root/store/app/hooks/use-set-page.ts';

const Search: FC<PropsType> = ({ isLoading, onChange }) => {
    const { t } = useTranslation();
    const [input, setInput] = useState<string>();
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();
    const { aesKey } = useAppSelector((state) => state.user);
    const setPage = useSetPage();

    const getVisibility = (visibilityClass: string, hiddenClass: string): string =>
        isVisible !== undefined ? (isVisible ? visibilityClass : hiddenClass) : '';

    useEffect(() => {
        onChange(input);
    }, [input]);

    const getChatInfo = (page: JSX.Element) => {
        setIsVisible(false);
        setPage(page);
    };

    return (
        <div id={styles.search}>
            <Input onChange={setInput} value={input} isLoading={isLoading} placeholder={t('search')} />
            <IoIosAddCircleOutline
                className={getVisibility(styles.show_cancel, styles.show_add)}
                id={styles.new_chat_icon}
                onClick={() => setIsVisible(true)}
            />
            <div
                id={styles.new_chats}
                ref={wrapperRef}
                className={getVisibility(styles.show_slowly, styles.hide_slowly)}
            >
                <div className={styles.new_chats_item}>
                    <div className={styles.new_chats_item_click}>
                        <AiOutlineGlobal className={styles.new_chats_item_logo} color="green" />
                        <div>{t('create_open_chat')}</div>
                    </div>
                    <IoMdInformationCircleOutline
                        className={styles.new_chats_item_info}
                        onClick={() => getChatInfo(<Info />)}
                    />
                </div>
                {!aesKey && (
                    <>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click}>
                                <LiaEyeSolid className={styles.new_chats_item_logo} color="green" />
                                <div>{t('create_shared_chat')}</div>
                            </div>
                            <IoMdInformationCircleOutline
                                className={styles.new_chats_item_info}
                                onClick={() => getChatInfo(<Info />)}
                            />
                        </div>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click}>
                                <RxLockOpen1 className={styles.new_chats_item_logo} color="green" />
                                <div>{t('create_public_chat')}</div>
                            </div>
                            <IoMdInformationCircleOutline
                                className={styles.new_chats_item_info}
                                onClick={() => getChatInfo(<Info />)}
                            />
                        </div>
                        <div className={styles.new_chats_item}>
                            <div className={styles.new_chats_item_click}>
                                <RxLockClosed className={styles.new_chats_item_logo} color="red" />
                                <div>{t('create_private_chat')}</div>
                            </div>
                            <IoMdInformationCircleOutline
                                className={styles.new_chats_item_info}
                                onClick={() => getChatInfo(<Info />)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;
