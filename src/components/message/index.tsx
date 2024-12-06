import { FC, useMemo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';

const Message: FC<PropsType> = ({ message, type, title, createdAt }) => {
    const { t } = useTranslation();
    const visibleMessage = useMemo(() => {
        return type == MessageTypeEnum.IS_SYSTEM ? `${t(message)} «${title}»` : message;
    }, []);

    const time = moment(createdAt).format('LT');

    return type == MessageTypeEnum.IS_SYSTEM ? (
        <div className={styles.system_background}>
            <div className={`${styles.background} ${styles.system_message}`}>{visibleMessage}</div>
        </div>
    ) : (
        <div className={`${styles.background}`}>
            <div>
                <pre>{visibleMessage}</pre>
            </div>
            <div className={styles.left_div2}>{time}</div>
        </div>
    );
};

export default Message;
