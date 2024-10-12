import { FC, useState } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import useVisibility from '../../common/hooks/use-visibility.ts';

const Question: FC<PropsType> = ({ question, answer }) => {
    const [isShow, setIsShow] = useState<boolean>();
    return (
        <div className={styles.background}>
            <div className={styles.question_block} onClick={() => setIsShow(!isShow)}>
                <MdOutlineCancel
                    className={`${styles.question_logo} ${useVisibility(styles.logo_show, styles.logo_cancel, isShow)}`}
                />
                {question}
            </div>
            <div className={`${styles.answer} ${useVisibility(styles.answer_show, styles.answer_hide, isShow)}`}>
                {answer}
            </div>
        </div>
    );
};

export default Question;
