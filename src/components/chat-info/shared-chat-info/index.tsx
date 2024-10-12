import { FC, useMemo } from 'react';
import ChatInfo from '../index.tsx';
import { LiaEyeSolid } from 'react-icons/lia';
import styles from '../index.module.css';
import { QuestionType } from '../types/question.type.ts';

const SharedChatInfo: FC = () => {
    const [title, description, questions] = useMemo(() => {
        const questions: QuestionType[] = [];

        for (let i = 1; i < 8; i++) questions.push({ question: `question_${i}`, answer: `answer_shared_${i}` });

        return ['create_shared_chat', 'description_shared_chat', questions];
    }, []);

    return (
        <ChatInfo
            icon={<LiaEyeSolid className={styles.title_icon} color={'green'} />}
            title={title}
            description={description}
            questions={questions}
        />
    );
};

export default SharedChatInfo;
