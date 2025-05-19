import { FC, useCallback, useContext, useEffect, useRef } from 'react';
import styles from './index.module.css';
import { PiArrowBendUpLeftFill } from 'react-icons/pi';
import { IoCopyOutline } from 'react-icons/io5';
import { ChatContext } from '../../pages/chat';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { GoLink } from 'react-icons/go';
import { useAppAction, useAppSelector } from '../../root/store';
import { getRawChat } from '../../root/store/chats/chats.raw.ts';
import { MessageType } from '../../root/types/chat/message.type.ts';

export const MenuMessage: FC = () => {
    const visibility = useVisibility;
    const ref = useRef<HTMLDivElement>(null);
    const { isPhone } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { clickMessage, isShowMessageMenu, setIsShowMessageMenu } = useContext(ChatContext)!;
    const { update, setChatOnPage } = useAppAction();

    const answerMessage = useCallback(() => {
        setIsShowMessageMenu(false);
        if (!chatOnPage?.id) return;
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
        };

        if (chat) update({ id: clickMessage.chatId, answerMessage });
        else setChatOnPage({ ...chatOnPage!, answerMessage });
    }, [clickMessage, chatOnPage?.id]);

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

    const handleClickOutside = useCallback((event: any) => {
        if (isShowMessageMenu && event && ref.current && !ref.current.contains(event.target)) {
            setTimeout(() => setIsShowMessageMenu(false), 50);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, false);
        return () => document.removeEventListener('click', handleClickOutside, false);
    }, []);

    return (
        <div
            id={styles.message_menu}
            className={visibility(styles.show_slowly, styles.hide_slowly, isShowMessageMenu)}
            ref={ref}
        >
            <div className={styles.message_menu_item} onClick={answerMessage}>
                <PiArrowBendUpLeftFill className={styles.message_menu_item_icon} />
                Ответить
            </div>
            <div className={styles.message_menu_item} onClick={copyMessage}>
                <IoCopyOutline className={styles.message_menu_item_icon} />
                Копировать текст
            </div>
            <div className={styles.message_menu_item} onClick={copyMessageWithChat}>
                <GoLink className={styles.message_menu_item_icon} />
                Копировать ссылку сообщения
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
};
