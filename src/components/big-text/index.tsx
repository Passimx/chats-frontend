import styles from './index.module.css';
import { FC } from 'react';
import { PropsType } from './types/props.type.ts';

const BigText: FC<PropsType> = ({ text }) => {
    return (
        <div id={styles.background} className={'text_translate'}>
            {text}
        </div>
    );
};

export default BigText;
