import { FC, useMemo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { useTranslation } from 'react-i18next';

const Message: FC<PropsType> = ({ message, type, title }) => {
    const { t } = useTranslation();
    const visibleMessage = useMemo(() => {
        return type == MessageTypeEnum.IS_SYSTEM ? `${t(message)} «${title}»` : message;
    }, []);

    return (
        <div className={`${type == MessageTypeEnum.IS_SYSTEM && styles.system_background}`}>
            <div
                className={`${styles.background} ${type == MessageTypeEnum.IS_SYSTEM ? styles.system_message : message}`}
            >
                {visibleMessage}
            </div>
        </div>
    );
};

export default Message;
