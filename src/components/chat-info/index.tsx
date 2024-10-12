import { FC } from 'react';
import { PropsType } from './types/props.type.ts';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import Question from '../qestion';

const ChatInfo: FC<PropsType> = ({ icon, title, description, questions }) => {
    const { t } = useTranslation();

    return (
        <div id={styles.background}>
            <div className={styles.title_block}>
                {icon}
                <div className={styles.title}>{t(title)}</div>
            </div>
            <div className={styles.description}>{t(description)}</div>
            <div className={styles.questions}>
                {questions.map(({ question, answer }) => (
                    <Question key={t(question)} question={t(question)} answer={t(answer)} />
                ))}
            </div>
        </div>
    );
};

export default ChatInfo;
