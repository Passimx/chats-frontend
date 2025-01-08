import useGetChat from './hooks/use-get-chat.hook.ts';
import styles from './index.module.css';
import { FC, MouseEvent, useEffect } from 'react';
import ChatAvatar from '../../components/chat-avatar';
import { IoArrowBackCircleOutline, IoCopyOutline } from 'react-icons/io5';
import InputMessage from '../../components/input-message';
import Message from '../../components/message';
import { useTranslation } from 'react-i18next';
import rawChats from '../../root/store/chats/chats.raw.ts';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
import { useAppAction, useAppSelector } from '../../root/store';
import { useDebouncedFunction } from '../../common/hooks/use-debounced-function.ts.ts';
import { useGetMessages } from './hooks/use-get-messages.hook.ts';
import { useJoinChat } from './hooks/use-join-chat.hook.ts';
import { CiMenuKebab } from 'react-icons/ci';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { MdExitToApp } from 'react-icons/md';
import { leaveChats } from '../../root/api/chats';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Chat: FC = () => {
    const [chat] = useGetChat();
    useJoinChat(chat);
    const visibility = useVisibility;
    const navigate = useNavigate();
    const messages = useGetMessages();
    const readMessage = useDebouncedFunction(1000);
    const { t } = useTranslation();
    const { postMessage } = useAppAction();
    const { chats } = useAppSelector((state) => state.chats);
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();

    useEffect(() => {}, [chats]);

    const addChat = () => {
        postMessage({
            data: {
                event: EventsEnum.ADD_CHAT,
                data: { ...chat!, messages: messages, readMessage: chat!.countMessages },
            },
        });
    };

    const back = (e: MouseEvent<unknown>) => {
        e.stopPropagation();
        document.documentElement.style.setProperty('--menu-margin', '0px');
    };

    const readMessageFunc = (number: number) => {
        if (!chat?.id) return;
        const num = rawChats.chats.get(chat.id)?.readMessage;
        if (num && number > num)
            readMessage(() =>
                postMessage({ data: { event: EventsEnum.READ_MESSAGE, data: { chatId: chat.id, number } } }),
            );
    };

    const leave = (e: MouseEvent<unknown>) => {
        const id = chat!.id;
        leaveChats([id]);
        postMessage({
            data: { event: EventsEnum.REMOVE_CHAT, data: id },
        });
        navigate('/');
        back(e);
    };
    if (!chat) return <></>;

    return (
        <div id={styles.background}>
            <Helmet>
                <title>{chat.title}</title>
            </Helmet>
            <div id={styles.main}>
                <div id={styles.header}>
                    <IoArrowBackCircleOutline onClick={back} id={styles.back_icon} />
                    <div id={styles.chat_inf}>
                        <ChatAvatar type={chat.type} />
                        <div id={styles.title}>{chat.title}</div>
                        <div id={styles.icon_block}>
                            <div>
                                <div id={styles.count_online}>30K</div>
                            </div>
                        </div>
                        <div id={styles.chat_menu_button} onClick={() => setIsVisible(true)}>
                            <CiMenuKebab id={styles.menu_icon} />
                        </div>
                    </div>
                </div>
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
                    {rawChats.chats.get(chat.id) && (
                        <div className={styles.chat_menu_item} onClick={leave}>
                            <MdExitToApp className={`${styles.chat_menu_item_icon} ${styles.rotate}`} />
                            <div>{t('leave_chat')}</div>
                        </div>
                    )}
                </div>
                {!rawChats.chats.get(chat.id) && (
                    <div className={styles.add_chat_block} onClick={addChat}>
                        <IoIosAddCircleOutline id={styles.new_chat_icon} />
                        {t('add_chat')}
                    </div>
                )}
            </div>
            <div id={styles.messages_main_block}>
                <div id={styles.messages_block}>
                    <div id={styles.messages}>
                        {messages.map(({ id, message, type, createdAt, number }) => (
                            <Message
                                key={id}
                                chatId={chat.id}
                                title={chat.title}
                                number={number}
                                message={message}
                                type={type}
                                createdAt={new Date(createdAt)}
                                readMessage={readMessageFunc}
                            />
                        ))}
                        <div></div>
                    </div>
                </div>
                <InputMessage />
            </div>
        </div>
    );
};

export default Chat;
