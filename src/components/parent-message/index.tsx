import { FC, useCallback } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { getVisibleMessage } from '../chat-item/hooks/use-visible-message.hook.ts';
import { useTranslation } from 'react-i18next';

export const ParentMessage: FC<PropsType> = (props) => {
    const { t } = useTranslation();
    const { number, findMessage } = props;
    const message = getVisibleMessage(props, t);

    const click = useCallback(() => {
        const element = document.getElementById(`message-${number}`);
        if (element) element.scrollIntoView();
        else if (findMessage) findMessage(props.number);
    }, []);

    return (
        <div onClick={click} className={styles.background}>
            {message}
        </div>
    );
};
