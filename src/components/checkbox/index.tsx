import { FC } from 'react';
import styles from './index.module.css';
import { PropsType } from './types.ts';

export const Checkbox: FC<PropsType> = ({ checked, onChange }) => {
    return (
        <label className={styles.toggle}>
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span className={styles.slider}></span>
        </label>
    );
};
