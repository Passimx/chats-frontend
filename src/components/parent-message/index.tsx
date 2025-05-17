import { FC, useCallback } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';

export const ParentMessage: FC<PropsType> = (props) => {
    const { message, number, findMessage } = props;
    const click = useCallback(() => {
        const element = document.getElementById(`message-${number}`);
        if (element) element.scrollIntoView();
        else findMessage(props);
    }, []);

    return (
        <div onClick={click} className={styles.background}>
            {message}
        </div>
    );
};
