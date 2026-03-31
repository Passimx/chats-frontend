import useGetChat from './hooks/use-get-chat.hook.ts';
import styles from './index.module.css';
import { FC, memo, useContext, useEffect } from 'react';
import { IoArrowBackCircleOutline, IoCopyOutline } from 'react-icons/io5';
import Message from '../../components/message';
import { useTranslation } from 'react-i18next';
import { getRawChat } from '../../root/store/raw/chats.raw.ts';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useAppAction, useAppSelector } from '../../root/store';
import { useMessages } from './hooks/use-messages.hook.ts';
import { useJoinChat } from './hooks/use-join-chat.hook.ts';
import { CiMenuKebab } from 'react-icons/ci';
import useClickOutside from '../../common/hooks/use-click-outside.ts';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import { MdExitToApp, MdQrCode2 } from 'react-icons/md';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { RxLockClosed } from 'react-icons/rx';
import { useMethods } from './hooks/use-methods.hooks.ts';
import { RotateLoading } from '../../components/rotate-loading';
import { FaStar } from 'react-icons/fa';
import { LoadingType } from './types/loading.type.ts';
import { MenuMessage } from '../../components/menu-message';
import { InputMessage } from '../../components/input-message';
import { QrCode } from '../../components/qr-code';
import { PinnedMessages } from '../../components/pinned-messages';
import { useGetChatTitle } from '../../common/hooks/use-get-chat-title.hook.ts';
import { Avatar } from '../../components/avatar';
import { EmptyMessages } from '../../components/empty-messages';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
import { useShortText } from '../../common/hooks/use-short-text.hook.ts';
import { useSwipeBack } from './hooks/use-swipe.hook.ts';
import { PiPhoneCallFill } from 'react-icons/pi';
import CallModal from '../../components/call-modal/index.tsx';
import { CallContext } from '../../root/contexts/call';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { leaveChat } from '../../root/api/chats';
import { createRoom } from '../../root/api/calls';

/** Main chat component */
const Chat: FC = memo(() => {
    useGetChat();
    useJoinChat();
    // useAutoScroll();
    const [addChat, back] = useMethods();
    useSwipeBack(back);
    const { t } = useTranslation();
    const [isLoading, showLastMessages] = useMessages();
    const [wrapperRef, isVisible, setIsVisible] = useClickOutside();
    const { setStateApp, postMessageToBroadCastChannel } = useAppAction();
    const chatOnPage = useAppSelector((state) => state.chats.chatOnPage);
    const shortName = useShortText(chatOnPage?.id);
    const title = useGetChatTitle(chatOnPage);

    const ownUserName = useAppSelector((state) => state.user.userName);
    const userId = useAppSelector((state) => state.user.id);
    const { setRoomId, setRouterRtpCapabilities } = useContext(CallContext);

    useEffect(() => {
        if (chatOnPage?.id) {
            setRoomId(chatOnPage.id);
        }
    }, [chatOnPage?.id, setRoomId]);

    if (!chatOnPage) return <></>;

    return (
        <div id={styles.background}>
            <MenuMessage />
            <div id={styles.main}>
                <div id={styles.header}>
                    <IoArrowBackCircleOutline onClick={back} id={styles.back_icon} />
                    <div id={styles.chat_inf}>
                        <Avatar
                            showIcon={[ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                            isClickable={![ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                        />
                        <div className={`${styles.title_block} text_translate`}>
                            <div className={styles.title_block_inline}>
                                {/* Chat title*/}
                                <h3 id={styles.title}>{title}</h3>

                                {/* icons for system chats*/}
                                {[ChatEnum.IS_SYSTEM].includes(chatOnPage.type) && (
                                    <FaStar className={styles.icon_star} />
                                )}
                                {[ChatEnum.IS_FAVORITES].includes(chatOnPage.type) && (
                                    <RxLockClosed className={styles.look_svg} color="red" />
                                )}
                            </div>
                        </div>
                        {!!chatOnPage.countMessages && (
                            <div id={styles.chat_menu_button} onClick={() => setIsVisible(true)}>
                                <CiMenuKebab id={styles.menu_icon} />
                            </div>
                        )}
                    </div>
                </div>
                <PinnedMessages />
                {!!chatOnPage.countMessages && !getRawChat(chatOnPage.id) && (
                    <div className={`${styles.add_chat_block} text_translate`} onClick={addChat}>
                        <IoIosAddCircleOutline id={styles.new_chat_icon} />
                        {t('add_chat')}
                    </div>
                )}
            </div>
            <div id={styles.messages_main_block}>
                {/*todo*/}
                {/*вынести меню чата в отдельный компонент как эмодзи*/}
                {
                    <div
                        id={styles.chat_menu}
                        className={setVisibilityCss(styles.show_slowly, styles.hide_slowly, isVisible)}
                        ref={wrapperRef}
                        onClick={() => setIsVisible(false)}
                    >
                        <div
                            className={styles.chat_menu_item}
                            onClick={() => {
                                setStateApp({
                                    page: (
                                        <QrCode
                                            url={window.location.origin + window.location.pathname}
                                            text={shortName}
                                        />
                                    ),
                                });
                            }}
                        >
                            <MdQrCode2 className={styles.chat_menu_item_icon} />
                            <div className={'text_translate'}>{t('qr_code')}</div>
                        </div>
                        <div
                            className={styles.chat_menu_item}
                            onClick={async () => {
                                if (!chatOnPage?.id || !userId) {
                                    console.error('Missing chatId or userId');
                                    return;
                                }

                                try {
                                    const result = await createRoom(chatOnPage.id, userId);

                                    if (!result.success) {
                                        console.error('Failed to create room:', result.data);
                                        return;
                                    }

                                    setRouterRtpCapabilities(result.data.routerRtpCapabilities);
                                    setStateApp({ page: <CallModal /> });
                                } catch (error) {
                                    console.error('Error creating room:', error);
                                }
                            }}
                        >
                            <PiPhoneCallFill className={styles.chat_menu_item_icon} />
                            <div className={'text_translate'}>{t('call')}</div>
                        </div>
                        <div
                            className={styles.chat_menu_item}
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + window.location.pathname);
                                postMessageToBroadCastChannel({ event: EventsEnum.SHOW_TEXT, data: 'copied' });
                            }}
                        >
                            <IoCopyOutline className={styles.chat_menu_item_icon} />
                            <div className={'text_translate'}>{t('copy_link')}</div>
                        </div>
                        {getRawChat(chatOnPage.id) && (
                            <div className={styles.chat_menu_item} onClick={() => leaveChat(chatOnPage!.id)}>
                                <MdExitToApp className={`${styles.chat_menu_item_icon} ${styles.rotate}`} />
                                <div className={'text_translate'}>{t('leave_chat')}</div>
                            </div>
                        )}
                    </div>
                }
                {/* Блок сообщений (переписка) */}
                {!!chatOnPage?.countMessages && (
                    <div id={styles.messages_block}>
                        <div></div>
                        <div id={styles.messages}>
                            {isLoading === LoadingType.OLD && <RotateLoading />}
                            {chatOnPage?.messages?.map((message) => {
                                return (
                                    <div
                                        key={message.id}
                                        id={`container_${message.number}`}
                                        className={`${message?.type === MessageTypeEnum.IS_USER && message?.user?.id === ownUserName ? styles.message_container_own : styles.message_container}`}
                                    >
                                        <Message {...{ ...message }} />
                                    </div>
                                );
                            })}
                            {isLoading === LoadingType.NEW && <RotateLoading />}
                        </div>
                    </div>
                )}
                {chatOnPage?.countMessages === 0 && <EmptyMessages />}
            </div>
            <InputMessage {...{ showLastMessages }} />
        </div>
    );
});

export default Chat;
