import { FC, useMemo } from 'react';
import ChatInfo from '../index.tsx';
import styles from '../index.module.css';
import { RxLockOpen1 } from 'react-icons/rx';
import { QuestionType } from '../types/question.type.ts';

const PublicChatInfo: FC = () => {
    const [title, description, questions] = useMemo(() => {
        const questions: QuestionType[] = [];

        for (let i = 1; i < 8; i++) questions.push({ question: `question_${i}`, answer: `answer_public_${i}` });

        return ['create_public_chat', 'description_public_chat', questions];
    }, []);

    return (
        <ChatInfo
            icon={<RxLockOpen1 className={styles.title_icon} color={'green'} />}
            title={title}
            description={description}
            questions={questions}
        />
    );
};

export default PublicChatInfo;
