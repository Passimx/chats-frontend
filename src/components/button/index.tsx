import { FC } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { ButtonEnum } from './types/button.enum.ts';

const Button: FC<Partial<PropsType>> = ({ value, onClick, styleType = ButtonEnum.WHITE, type }) => {
    return (
        <button type={type} onClick={onClick} className={`${styles.button} ${styles[styleType]}`}>
            {value}
        </button>
    );
};

export default Button;
