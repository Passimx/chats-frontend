import { FC } from 'react';
import { PropsType } from './props.type.ts';
import styles from './styles.module.css';

export const LoadRadius: FC<PropsType> = ({ percent = 0, radius: r, strokeWidth }) => {
    const size = 2 * r;
    const center = r;
    const radius = r - strokeWidth / 2; // корректируем радиус
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);

    return (
        <div className={styles.background} style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Progress ${percent}%`}>
                <circle cx={center} cy={center} r={radius} fill="none" stroke="black" strokeWidth={strokeWidth} />
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="white"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </svg>
        </div>
    );
};
