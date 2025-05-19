import { FC, memo, useContext, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { useVisibility } from './hooks/use-visibility.hook.ts';
import { RenderMessage } from '../render-message';
import { ParentMessage } from '../parent-message';
import styles2 from '../menu-message/index.module.css';
import { ChatContext } from '../../pages/chat';
import { useAppSelector } from '../../root/store';

const Message: FC<PropsType> = memo((props) => {
    const { number, type, findMessage } = props;
    const elementId = useMemo(() => `message-${number}`, [number]);
    const [observerTarget, visibleMessage, time] = useVisibility(props);
    const { setClickMessage, setIsShowMessageMenu } = useContext(ChatContext)!;
    const { isPhone } = useAppSelector((state) => state.app);

    useEffect(() => {
        const element = document.getElementById(elementId)!;
        const func = (event: MouseEvent) => {
            if (!isPhone) event.preventDefault();
            if (props.type === MessageTypeEnum.IS_CREATED_CHAT) return setIsShowMessageMenu(false);
            setIsShowMessageMenu(undefined);
            setTimeout(() => setIsShowMessageMenu(true), 10);
            const element = document.getElementById(styles2.message_menu)!;
            const gap = '16px';

            setClickMessage(props);

            if (window.innerHeight / 2 > event.y) element.style.marginTop = `calc(${event.y}px + ${gap})`;
            else element.style.marginTop = `calc(${event.y}px - ${element.clientHeight}px - ${gap})`;

            if (window.innerWidth / 2 > event.x)
                element.style.marginLeft = `calc(${event.x}px - var(--menu-width) + ${gap} + var(--menu-margin))`;
            else
                element.style.marginLeft = `calc(${event.x}px - var(--menu-width) - ${element.clientWidth}px - ${gap} + var(--menu-margin))`;
        };

        element.addEventListener('contextmenu', func);

        return () => element.removeEventListener('contextmenu', func);
    }, [isPhone]);

    if (type == MessageTypeEnum.IS_CREATED_CHAT)
        return (
            <div ref={observerTarget} id={elementId} className={styles.system_background}>
                <div className={`${styles.background} ${styles.system_message}`}>{visibleMessage}</div>
            </div>
        );

    return (
        <>
            <div ref={observerTarget} id={elementId} className={`${styles.background}`}>
                {props.parentMessage && <ParentMessage {...{ ...props.parentMessage, findMessage }} />}
                <RenderMessage message={visibleMessage} />
                <div className={styles.left_div2}>{time}</div>
            </div>
        </>
    );
});

export default Message;
