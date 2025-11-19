import { FC } from 'react';
import { PropsType } from './types.ts';
import styles from './index.module.css';
import { RotateLoading } from '../../../rotate-loading';

export const LoadingQrCode: FC<PropsType> = ({ width, height }) => {
    return (
        <div className={styles.background} style={{ width, height }}>
            <RotateLoading />
        </div>
    );
};
