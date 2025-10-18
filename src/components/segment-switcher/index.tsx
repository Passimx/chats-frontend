import { FC, useCallback, useEffect, useRef } from 'react';
import styles from './index.module.css';
import { PropsType } from './types.ts';

export const SegmentSwitcher: FC<PropsType> = ({ options, value: valueOutside, onChange }) => {
    const slider = useRef<HTMLInputElement>(null);
    const change = useCallback(
        (index: number) => {
            const option = options[index][1];
            onChange(option);
        },
        [options],
    );

    useEffect(() => {
        if (!slider) return;

        const changeValue = () => {
            const value =
                ((Number(slider.current?.value) - Number(slider.current?.min)) /
                    (Number(slider.current?.max) - Number(slider.current?.min))) *
                100;
            slider.current?.style.setProperty('--value', `${value}%`);
        };

        changeValue();
        slider.current?.addEventListener('input', changeValue);
    }, [slider]);

    return (
        <div className={styles.background}>
            <input
                ref={slider}
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
                        <div className={'text_translate'}>
                            <pre>{text}</pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
