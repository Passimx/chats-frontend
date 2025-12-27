import { FC, useState } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';

const Question: FC<PropsType> = ({ question, answer }) => {
    const [isShow, setIsShow] = useState<boolean>();
    return (
        <div className={styles.background}>
            <div
                className={`${styles.question_block} text_translate`}
                style={{ backgroundImage: 'url("/assets/images/question.png")' }}
                onClick={() => setIsShow(!isShow)}
            >
                <MdOutlineCancel
                    className={`${styles.question_logo} ${setVisibilityCss(styles.logo_show, styles.logo_cancel, isShow)}`}
                />
                {question}
            </div>
            <div
                className={`${styles.answer} ${setVisibilityCss(styles.answer_show, styles.answer_hide, isShow)} text_translate`}
            >
                {answer}
            </div>
        </div>
    );
};

export default Question;
