import { FC, useCallback } from 'react';
import styles from './index.module.css';
import { PropsType } from './types.ts';

export const SegmentSwitcher: FC<PropsType> = ({ options, value: valueOutside, onChange }) => {
    const change = useCallback(
        (index: number) => {
            const option = options[index][1];
            onChange(option);
        },
        [options],
    );

    return (
        <div className={styles.background}>
            <input
                min={0}
                step={1}
                type="range"
                max={options.length - 1}
                className={styles.slider}
                defaultValue={options.findIndex((option) => option[1] === valueOutside)}
                onChange={(event) => change(Number(event.target.value))}
            />
            <div className={styles.options_background}>
                {options.map(([text], index) => (
                    <div key={index} className={styles.options_item}>
                        <div className={'text_translate'}>{text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
