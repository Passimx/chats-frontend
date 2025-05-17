import { FC, memo, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { useVisibility } from './hooks/use-visibility.hook.ts';
import { RenderMessage } from '../render-message';
import { ParentMessage } from '../parent-message';

const Message: FC<PropsType> = memo((props) => {
    const { number, type, findMessage } = props;
    const elementId = useMemo(() => `message-${number}`, [number]);
    const [observerTarget, visibleMessage, time] = useVisibility(props);

    useEffect(() => {
        const element = document.getElementById(elementId)!;
        const func = (event: MouseEvent) => {
            event.preventDefault();
        };
        element.addEventListener('contextmenu', func);

        return () => element.removeEventListener('contextmenu', func);
    }, []);

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
