import { FC, memo } from 'react';
import styles from './index.module.css';

export const EmptyMessages: FC = memo(() => {
    return (
        <div className={styles.background}>
            <div className={styles.text_background}>
                <div className={styles.text1}>Сообщений нет</div>
                <div className={styles.text2}>Отправьте первое сообщение</div>
            </div>
        </div>
    );
});
