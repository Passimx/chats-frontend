import { FC, useCallback, useContext, useEffect, useRef } from 'react';
import styles from './index.module.css';
import { PiArrowBendUpLeftFill } from 'react-icons/pi';
import { IoCopyOutline } from 'react-icons/io5';
import { MdOutlinePlaylistAddCheck } from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';
import { ChatContext } from '../../pages/chat';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { GoLink } from 'react-icons/go';

export const MenuMessage: FC = () => {
    const visibility = useVisibility;
    const ref = useRef<HTMLDivElement>(null);
    const { clickMessage, isShowMessageMenu, setAnswerMessage, setIsShowMessageMenu } = useContext(ChatContext)!;

    const answerMessage = useCallback(() => {
        setIsShowMessageMenu(false);
        if (clickMessage) setAnswerMessage(clickMessage);
    }, [clickMessage]);

    const copyMessage = useCallback(() => {
        if (!clickMessage) return;
        setIsShowMessageMenu(false);
        const element = document.getElementById(`message-${clickMessage}`)!;
        const text = element.getElementsByTagName('pre')[0].innerText;
        navigator.clipboard.writeText(text);
    }, [clickMessage]);

    const copyMessageWithChat = useCallback(() => {
        const url = new URL(window.location.href);
        url.search = ''; // удаляем query-параметры
        setIsShowMessageMenu(false);

        navigator.clipboard.writeText(`${url}?message=${clickMessage}`);
    }, [clickMessage]);

    const handleClickOutside = useCallback((event: any) => {
        if (event && ref.current && !ref.current.contains(event.target)) {
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
            <div className={styles.message_menu_item}>
                <MdOutlinePlaylistAddCheck className={styles.message_menu_item_icon} />
                Выбрать
            </div>
            <div className={styles.message_menu_item}>
                <FiExternalLink className={styles.message_menu_item_icon} />
                Переслать
            </div>
        </div>
    );
};
