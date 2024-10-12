import { FC, useMemo } from 'react';
import ChatInfo from '../index.tsx';
import styles from '../index.module.css';
import { RxLockClosed } from 'react-icons/rx';
import { QuestionType } from '../types/question.type.ts';

const PrivateChatInfo: FC = () => {
    const [title, description, questions] = useMemo(() => {
        const questions: QuestionType[] = [];

        for (let i = 1; i < 8; i++) questions.push({ question: `question_${i}`, answer: `answer_private_${i}` });

        return ['create_private_chat', 'description_private_chat', questions];
    }, []);

    return (
        <ChatInfo
            icon={<RxLockClosed className={styles.title_icon} color={'red'} />}
            title={title}
            description={description}
            questions={questions}
        />
    );
};

export default PrivateChatInfo;
