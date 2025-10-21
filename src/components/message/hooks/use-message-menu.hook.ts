import { useContext, useEffect, useMemo } from 'react';
import { ContextChat } from '../../../pages/chat/context/chat-context.tsx';
import { useAppSelector } from '../../../root/store';
import { MessageType } from '../../../root/types/chat/message.type.ts';
import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import styles2 from '../../menu-message/index.module.css';

export const useMessageMenu = (message: MessageType) => {
    const { id, type } = message;
    const elementId = useMemo(() => `message-${id}`, [id]);
    const { setClickMessage, setIsShowMessageMenu, isShowMessageMenu } = useContext(ContextChat)!;
    const { isPhone } = useAppSelector((state) => state.app);

    useEffect(() => {
        let longPressTimer: NodeJS.Timeout;
        const messageDiv = document.getElementById(elementId)!;

        const setMenuPosition = (event: MouseEvent | TouchEvent) => {
            const y: number = event instanceof MouseEvent ? event.y : event.touches[0].clientY;

            event.preventDefault();
            if (type === MessageTypeEnum.IS_CREATED_CHAT) {
                if (isShowMessageMenu) setIsShowMessageMenu(false);
                return;
            }
            setTimeout(() => setIsShowMessageMenu(true), 10);
            const element = document.getElementById(styles2.message_menu)!;
            const gap = '16px';

            setClickMessage(message);

            if (window.innerHeight / 2 > y) element.style.marginTop = `calc(${y}px + ${gap})`;
            else element.style.marginTop = `calc(${y}px - ${element.clientHeight}px - ${gap})`;

            if (isPhone) element.style.marginLeft = `calc(${window.innerWidth - element.clientWidth}px / 2)`;
            else
                element.style.marginLeft = `calc((${window.innerWidth - element.clientWidth}px + (var(--menu-margin) - var(--menu-width)) / 2) / 2)`;
        };

        const appleFunc = (e: TouchEvent) => {
            if (e.touches.length > 1) return;
            longPressTimer = setTimeout(() => setMenuPosition(e), 600);
        };

        const clearTimeOut = () => clearTimeout(longPressTimer);

        if (isPhone) {
            messageDiv.addEventListener('touchstart', appleFunc);
            messageDiv.addEventListener('touchend', clearTimeOut);
            messageDiv.addEventListener('touchmove', clearTimeOut);
        } else messageDiv.addEventListener('contextmenu', setMenuPosition);
        return () => {
            if (isPhone) {
                messageDiv.removeEventListener('touchstart', appleFunc);
                messageDiv.removeEventListener('touchend', clearTimeOut);
                messageDiv.removeEventListener('touchmove', clearTimeOut);
            } else messageDiv.removeEventListener('contextmenu', setMenuPosition);
        };
    }, [isPhone, isShowMessageMenu]);

    return [elementId];
};
