import { QuestionType } from './question.type.ts';

export type PropsType = {
    icon: JSX.Element;
    title: string;
    description: string;

    questions: QuestionType[];
};
