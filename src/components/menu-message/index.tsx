import { FC, memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import styles from './index.module.css';
import { PiArrowBendUpLeftFill, PiPushPinSimpleSlashThin, PiPushPinSimpleThin } from 'react-icons/pi';
import { IoCopyOutline } from 'react-icons/io5';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import { GoLink } from 'react-icons/go';
import { useAppAction, useAppSelector } from '../../root/store';
import { getRawChat } from '../../root/store/raw/chats.raw.ts';
import { MessageType } from '../../root/types/chat/message.type.ts';
import { useTranslation } from 'react-i18next';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { ContextChat } from '../../pages/chat/context/chat-context.tsx';
import { EventsEnum } from '../../root/types/events/events.enum.ts';

export const MenuMessage: FC = memo(() => {
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>(null);
    const { isPhone } = useAppSelector((state) => state.app);
    const { clickMessage, isShowMessageMenu, setIsShowMessageMenu } = useContext(ContextChat)!;
    const { update, setChatOnPage, postMessageToBroadCastChannel } = useAppAction();
    const pinnedMessages = useAppSelector((state) => state.chats.chatOnPage?.pinnedMessages);

    useEffect(() => {
        if (isShowMessageMenu) setIsShowMessageMenu(false);
    }, [isPhone]);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isShowMessageMenu && event && ref.current && !ref.current.contains(event.target)) {
                setTimeout(() => setIsShowMessageMenu(false), 50);
            }
        };

        if (isShowMessageMenu) document.addEventListener('click', handleClickOutside, false);
        return () => {
            if (isShowMessageMenu) document.removeEventListener('click', handleClickOutside, false);
        };
    }, [isShowMessageMenu]);

    const isPin = useMemo(
        () => !!pinnedMessages?.find((message) => message.id === clickMessage?.id),
        [pinnedMessages?.length, clickMessage?.id],
    );

    const answerMessage = useCallback(() => {
        setIsShowMessageMenu(false);
        if (!clickMessage) return;

        const chat = getRawChat(clickMessage.chatId);
        const answerMessage: MessageType = {
            message: clickMessage.message,
            number: clickMessage.number,
            type: clickMessage.type,
            chatId: clickMessage.chatId,
            id: clickMessage.id,
            createdAt: clickMessage.createdAt,
            parentMessageId: clickMessage.parentMessageId,
            files: clickMessage.files,
            saveAt: clickMessage.saveAt,
        };

        if (chat) update({ id: clickMessage.chatId, answerMessage });
        else setChatOnPage({ answerMessage });
    }, [clickMessage]);

    const copyMessage = useCallback(() => {
        setIsShowMessageMenu(false);
        if (!clickMessage) return;
        const element = document.getElementById(`message-${clickMessage.number}`)!;
        const text = element.getElementsByTagName('pre')[0].innerText;
        postMessageToBroadCastChannel({ event: EventsEnum.COPY_TEXT, data: text });
    }, [clickMessage]);

    const copyMessageWithChat = useCallback(() => {
        setIsShowMessageMenu(false);
        const url = new URL(window.location.href);
        url.search = ''; // удаляем query-параметры
        postMessageToBroadCastChannel({ event: EventsEnum.COPY_TEXT, data: `${url}?number=${clickMessage?.number}` });
    }, [clickMessage]);

    const pin = useCallback(() => {
        setIsShowMessageMenu(false);
        if (!clickMessage) return;

        const messages = [...(pinnedMessages ?? []), clickMessage].sort(
            (message1, message2) => message1.number - message2.number,
        );
        update({ id: clickMessage.chatId, pinnedMessages: messages });
    }, [clickMessage?.id, pinnedMessages?.length]);

    const unpin = useCallback(() => {
        setIsShowMessageMenu(false);
        if (!clickMessage) return;

        const messages = [...(pinnedMessages ?? [])].filter((message) => message.id !== clickMessage.id);
        update({ id: clickMessage.chatId, pinnedMessages: messages });
    }, [clickMessage?.id, pinnedMessages?.length]);

    return (
        <div
            id={styles.message_menu}
            className={setVisibilityCss(styles.show_slowly, styles.hide_slowly, isShowMessageMenu)}
            ref={ref}
        >
            {clickMessage?.type !== MessageTypeEnum.IS_SYSTEM && (
                <div className={styles.message_menu_item} onClick={answerMessage}>
                    <PiArrowBendUpLeftFill className={styles.message_menu_item_icon} />
                    {t('reply')}
                </div>
            )}
            {clickMessage?.message && (
                <div className={styles.message_menu_item} onClick={copyMessage}>
                    <IoCopyOutline className={styles.message_menu_item_icon} />
                    {t('copy_text')}
                </div>
            )}
            <div className={styles.message_menu_item} onClick={copyMessageWithChat}>
                <GoLink className={styles.message_menu_item_icon} />
                {t('copy_message_link')}
            </div>

            {!isPin ? (
                <div className={styles.message_menu_item} onClick={pin}>
                    <PiPushPinSimpleThin className={styles.message_menu_item_icon} />
                    {t('pin')}
                </div>
            ) : (
                <div className={styles.message_menu_item} onClick={unpin}>
                    <PiPushPinSimpleSlashThin className={styles.message_menu_item_icon} />
                    {t('unpin')}
                </div>
            )}
            {/*<div className={styles.message_menu_item}>*/}
            {/*    <MdOutlinePlaylistAddCheck className={styles.message_menu_item_icon} />*/}
            {/*    Выбрать*/}
            {/*</div>*/}
            {/*<div className={styles.message_menu_item}>*/}
            {/*    <FiExternalLink className={styles.message_menu_item_icon} />*/}
            {/*    Переслать*/}
            {/*</div>*/}
        </div>
    );
});
