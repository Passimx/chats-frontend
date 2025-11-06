import { FC, memo, useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { useAppSelector } from '../../root/store';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { getVisibleMessage } from '../chat-item/hooks/use-visible-message.hook.ts';
import { useTranslation } from 'react-i18next';
import { BsPinAngleFill } from 'react-icons/bs';

export const PinnedMessages: FC = memo(() => {
    const { t } = useTranslation();
    const [index, setIndex] = useState<number>();
    const navigate = useCustomNavigate();
    const pinnedMessages = useAppSelector((state) => state.chats.chatOnPage?.pinnedMessages);
    const [visibleMessage, setVisibleMessage] = useState<string>();

    useEffect(() => {
        if (!pinnedMessages?.length) return setIndex(undefined);
        setIndex(pinnedMessages.length - 1);
    }, [pinnedMessages]);

    const click = useCallback(() => {
        if (!pinnedMessages?.length) return;
        if (index === undefined) return;

        const message = pinnedMessages[index];
        navigate(`/${message.chatId}?number=${message.number}`);

        let newIndex: number = index - 1;
        if (newIndex < 0) newIndex = pinnedMessages.length - 1;
        setIndex(newIndex);
    }, [index, pinnedMessages]);

    useEffect(() => {
        if (index === undefined) return;
        if (!pinnedMessages?.length) return;

        const message = pinnedMessages[index];
        if (!message) return;

        const visibleMessage: string = getVisibleMessage(pinnedMessages[index], t);
        setVisibleMessage(visibleMessage);
    }, [index, pinnedMessages]);

    if (pinnedMessages?.length && index !== undefined)
        return (
            <div className={styles.background} onClick={click}>
                <div className={styles.background_messages}>
                    <div className={styles.title}>Закрепленные сообщения ({pinnedMessages?.length})</div>
                    <div className={styles.visible_message}>
                        <div className={styles.visible_message_index}>{index + 1})</div>
                        <div>{visibleMessage}</div>
                    </div>
                </div>
                <div className={styles.background_icon}>
                    <BsPinAngleFill className={styles.icon} />
                </div>
            </div>
        );
});
