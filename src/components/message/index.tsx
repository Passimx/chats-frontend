import { FC, memo, useContext, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { useVisibility } from './hooks/use-visibility.hook.ts';
import { RenderMessage } from '../render-message';
import { ParentMessage } from '../parent-message';
import styles2 from '../menu-message/index.module.css';
import { useAppSelector } from '../../root/store';
import { ContextChat } from '../../pages/chat/context/chat-context.tsx';

const Message: FC<PropsType> = memo((props) => {
    const { number, type, findMessage } = props;
    const elementId = useMemo(() => `message-${number}`, [number]);
    const [observerTarget, visibleMessage, time] = useVisibility(props);
    const { setClickMessage, setIsShowMessageMenu, isShowMessageMenu } = useContext(ContextChat)!;
    const { isPhone } = useAppSelector((state) => state.app);

    useEffect(() => {
        let longPressTimer: NodeJS.Timeout;
        const messageDiv = document.getElementById(elementId)!;

        const setMenuPosition = (event: MouseEvent | TouchEvent) => {
            const y: number = event instanceof MouseEvent ? event.y : event.touches[0].clientY;

            event.preventDefault();
            if (props.type === MessageTypeEnum.IS_CREATED_CHAT) {
                if (isShowMessageMenu) setIsShowMessageMenu(false);
                return;
            }
            setTimeout(() => setIsShowMessageMenu(true), 10);
            const element = document.getElementById(styles2.message_menu)!;
            const gap = '16px';

            setClickMessage(props);

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

    if (type == MessageTypeEnum.IS_CREATED_CHAT)
        return (
            <div ref={observerTarget} id={elementId} className={styles.system_background}>
                <div className={`${styles.background} ${styles.system_message} text_translate`}>{visibleMessage}</div>
            </div>
        );

    return (
        <>
            <div ref={observerTarget} id={elementId} className={`${styles.background}`}>
                {props.parentMessage && <ParentMessage {...{ ...props.parentMessage, findMessage }} />}
                <RenderMessage message={visibleMessage} type={type} files={props.files} />
                <div className={`${styles.left_div2} text_translate`}>{time}</div>
            </div>
        </>
    );
});

export default Message;
