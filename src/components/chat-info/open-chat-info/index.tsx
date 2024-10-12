import { FC, useMemo } from 'react';
import ChatInfo from '../index.tsx';
import { AiOutlineGlobal } from 'react-icons/ai';
import styles from '../index.module.css';
import { QuestionType } from '../types/question.type.ts';

const OpenChatInfo: FC = () => {
    const [title, description, questions] = useMemo(() => {
        const questions: QuestionType[] = [];

        for (let i = 1; i < 8; i++) questions.push({ question: `question_${i}`, answer: `answer_open_${i}` });

        return ['create_open_chat', 'description_open_chat', questions];
    }, []);

    return (
        <ChatInfo
            icon={<AiOutlineGlobal className={styles.title_icon} color={'green'} />}
            title={title}
            description={description}
            questions={questions}
        />
    );
};

export default OpenChatInfo;
