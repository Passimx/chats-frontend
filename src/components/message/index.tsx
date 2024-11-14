import { FC } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';

const Message: FC<PropsType> = ({ message, createdAt }) => {
    return (
        <div className={styles.background}>
            {message} {createdAt.getMonth()}
        </div>
    );
};

export default Message;
