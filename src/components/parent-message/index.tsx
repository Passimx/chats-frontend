import { FC, useCallback } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { getVisibleMessage } from '../chat-item/hooks/use-visible-message.hook.ts';
import { useTranslation } from 'react-i18next';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';

export const ParentMessage: FC<PropsType> = (props) => {
    const { t } = useTranslation();
    const message = getVisibleMessage(props, t);

    const navigate = useCustomNavigate();

    const click = useCallback(() => {
        navigate(`/${props.chatId}?message=${props.id}`);
        const element = document.getElementById(`message-${props.id}`);
        if (element) element.scrollIntoView();
    }, []);

    return (
        <div onClick={click} className={styles.background}>
            {message}
        </div>
    );
};
