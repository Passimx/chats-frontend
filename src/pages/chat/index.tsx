import useGetChat from './hooks/use-get-chat.hook.ts';
import styles from './index.module.css';
import { createContext, FC, memo, useMemo, useState } from 'react';
import ChatAvatar from '../../components/chat-avatar';
import { IoArrowBackCircleOutline, IoCopyOutline } from 'react-icons/io5';
import InputMessage from '../../components/input-message';
import Message from '../../components/message';
import { useTranslation } from 'react-i18next';
import { getRawChat } from '../../root/store/chats/chats.raw.ts';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useAppSelector } from '../../root/store';
import { useMessages } from './hooks/use-messages.hook.ts';
import { useJoinChat } from './hooks/use-join-chat.hook.ts';
import { CiMenuKebab } from 'react-icons/ci';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { MdExitToApp } from 'react-icons/md';
import { IconEnum } from '../../components/chat-avatar/types/icon.enum.ts';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { AiOutlineGlobal } from 'react-icons/ai';
import { LiaEyeSolid } from 'react-icons/lia';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';
import { useMethods } from './hooks/use-methods.hooks.ts';
import { RotateLoading } from '../../components/rotate-loading';
import { useListenScroll } from './hooks/use-listen-scroll.hook.ts';
import { FaStar } from 'react-icons/fa';
import { LoadingType } from './types/loading.type.ts';
import { MenuMessage } from '../../components/menu-message';
import { MessageType } from '../../root/types/chat/message.type.ts';

type ContextType = {
    clickMessage?: MessageType;
    isShowMessageMenu?: boolean;
    setClickMessage: (value: MessageType) => void;
    setIsShowMessageMenu: (value?: boolean) => void;
};

export const ChatContext = createContext<ContextType | null>(null);

const Chat: FC = memo(() => {
    const [clickMessage, setClickMessage] = useState<MessageType>();
    const [isShowMessageMenu, setIsShowMessageMenu] = useState<boolean>();

    const { chatOnPage } = useAppSelector((state) => state.chats);
    useGetChat();
    useJoinChat(chatOnPage);
    const visibility = useVisibility;
    const { t } = useTranslation();
    const [isLoading, messages, readMessage, showLastMessages, findMessage] = useMessages();
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();
    const [addChat, leave, back] = useMethods(messages);
    const [isVisibleBottomButton] = useListenScroll(messages);
    const value = useMemo<ContextType>(
        () => ({ clickMessage, isShowMessageMenu, setClickMessage, setIsShowMessageMenu }),
        [clickMessage, isShowMessageMenu, setClickMessage, setIsShowMessageMenu],
    );

    if (!chatOnPage) return <></>;

    return (
        <ChatContext.Provider value={value}>
            <div id={styles.background}>
                <MenuMessage />
                <div id={styles.main}>
                    <div id={styles.header}>
                        <IoArrowBackCircleOutline onClick={back} id={styles.back_icon} />
                        <div id={styles.chat_inf}>
                            <ChatAvatar
                                onlineCount={chatOnPage.online}
                                maxUsersOnline={chatOnPage.maxUsersOnline}
                                iconType={IconEnum.ONLINE}
                                isChange={chatOnPage.type !== ChatEnum.IS_SYSTEM}
                                isSystem={chatOnPage.type === ChatEnum.IS_SYSTEM}
                            />
                            <div className={styles.title_block}>
                                {chatOnPage.type === ChatEnum.IS_SYSTEM && <FaStar className={styles.icon_star} />}
                                <div id={styles.title}>{chatOnPage.title}</div>
                            </div>
                            <div className={styles.icon}>
                                {chatOnPage.type === ChatEnum.IS_OPEN && (
                                    <AiOutlineGlobal className={styles.type_icon} color="green" />
                                )}
                                {chatOnPage.type === ChatEnum.IS_SHARED && (
                                    <LiaEyeSolid className={styles.look_svg} color="green" />
                                    // <IoIosMicrophone className={styles.look_svg} color="green" />
                                    // <RiUserVoiceFill className={styles.look_svg} color="green" />
                                )}
                                {chatOnPage.type === ChatEnum.IS_PUBLIC && (
                                    <RxLockOpen1 className={styles.look_svg} color="green" />
                                )}
                                {chatOnPage.type === ChatEnum.IS_PRIVATE && (
                                    <RxLockClosed className={styles.look_svg} color="red" />
                                )}
                            </div>
                            <div id={styles.chat_menu_button} onClick={() => setIsVisible(true)}>
                                <CiMenuKebab id={styles.menu_icon} />
                            </div>
                        </div>
                    </div>
                    {!getRawChat(chatOnPage.id) && (
                        <div className={styles.add_chat_block} onClick={addChat}>
                            <IoIosAddCircleOutline id={styles.new_chat_icon} />
                            {t('add_chat')}
                        </div>
                    )}
                </div>
                <div id={styles.messages_main_block}>
                    {/*todo*/}
                    {/*вынести меню чата в отдельный компонент как эмодзи*/}
                    <div
                        id={styles.chat_menu}
                        className={visibility(styles.show_slowly, styles.hide_slowly, isVisible)}
                        ref={wrapperRef}
                        onClick={() => setIsVisible(false)}
                    >
                        <div
                            className={styles.chat_menu_item}
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                            }}
                        >
                            <IoCopyOutline className={styles.chat_menu_item_icon} />
                            <div>{t('copy_link')}</div>
                        </div>
                        {getRawChat(chatOnPage.id) && chatOnPage?.type !== ChatEnum.IS_SYSTEM && (
                            <div className={styles.chat_menu_item} onClick={leave}>
                                <MdExitToApp className={`${styles.chat_menu_item_icon} ${styles.rotate}`} />
                                <div>{t('leave_chat')}</div>
                            </div>
                        )}
                    </div>
                    <div id={styles.messages_block}>
                        <div id={styles.messages}>
                            {isLoading === LoadingType.NEW && <RotateLoading />}
                            {messages.map((message) => (
                                <Message key={message.id} {...{ ...message, readMessage, findMessage }} />
                            ))}
                            <div></div>
                            {isLoading === LoadingType.OLD && <RotateLoading />}
                        </div>
                    </div>
                </div>
                <InputMessage {...{ isVisibleBottomButton, showLastMessages }} />
            </div>
        </ChatContext.Provider>
    );
});

export default Chat;
