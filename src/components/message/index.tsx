import { FC, memo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { useVisibility } from './hooks/use-visibility.hook.ts';

const Message: FC<PropsType> = memo((props) => {
    const { number, type } = props;
    const [observerTarget, visibleMessage, time] = useVisibility(props);

    if (type == MessageTypeEnum.IS_SYSTEM)
        return (
            <div ref={observerTarget} id={`message${number}`} className={styles.system_background}>
                <div className={`${styles.background} ${styles.system_message}`}>{visibleMessage}</div>
            </div>
        );

    return (
        <>
            <div ref={observerTarget} id={`message${number}`} className={`${styles.background}`}>
                <div>
                    <pre className={styles.text}>{visibleMessage}</pre>
                </div>
                <div className={styles.left_div2}>{time}</div>
            </div>
        </>
    );
});

export default Message;
