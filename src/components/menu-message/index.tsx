import { FC, memo, useCallback, useContext, useEffect, useRef } from 'react';
import styles from './index.module.css';
import { PiArrowBendUpLeftFill } from 'react-icons/pi';
import { IoCopyOutline } from 'react-icons/io5';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { GoLink } from 'react-icons/go';
import { useAppAction, useAppSelector } from '../../root/store';
import { getRawChat } from '../../root/store/chats/chats.raw.ts';
import { MessageType } from '../../root/types/chat/message.type.ts';
import { useTranslation } from 'react-i18next';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { ContextChat } from '../../pages/chat/context/chat-context.tsx';

export const MenuMessage: FC = memo(() => {
    const visibility = useVisibility;
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>(null);
    const { isPhone } = useAppSelector((state) => state.app);
    const { clickMessage, isShowMessageMenu, setIsShowMessageMenu } = useContext(ContextChat)!;
    const { update, setChatOnPage } = useAppAction();

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

    useEffect(() => {
        if (isShowMessageMenu) setIsShowMessageMenu(false);
    }, [isPhone]);

    const copyMessage = useCallback(() => {
        if (!clickMessage) return;
        setIsShowMessageMenu(false);
        const element = document.getElementById(`message-${clickMessage.number}`)!;
        const text = element.getElementsByTagName('pre')[0].innerText;
        navigator.clipboard.writeText(text);
    }, [clickMessage]);

    const copyMessageWithChat = useCallback(() => {
        const url = new URL(window.location.href);
        url.search = ''; // удаляем query-параметры
        setIsShowMessageMenu(false);

        navigator.clipboard.writeText(`${url}?message=${clickMessage?.number}`);
    }, [clickMessage]);

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

    return (
        <div
            id={styles.message_menu}
            className={visibility(styles.show_slowly, styles.hide_slowly, isShowMessageMenu)}
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
