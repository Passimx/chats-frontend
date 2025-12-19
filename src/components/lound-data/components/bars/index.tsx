import { FC, memo, useContext } from 'react';
import { PropsType } from './types.ts';
import styles from './index.module.css';
import { AudioPlayerContext } from '../../../../root/contexts/audio-player';

export const Bars: FC<PropsType> = memo(({ flip, displayData, fileId }) => {
    const { progress, audio } = useContext(AudioPlayerContext)!;

    const height = 17;
    const minHeight = 5;

    return (
        <div
            className={styles.background}
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                gap: '2px',
                height: '20px',
                alignItems: 'flex-end',
                //gridTemplateColumns: `repeat(${displayData.length}, 1fr)`,
                //transform: flip ? 'scaleY(-1)' : 'none',
            }}
        >
            {displayData.map((val, idx) => {
                let barPosition;
                let isPlayed;
                if (audio?.file.id === fileId && progress) {
                    barPosition = idx / displayData.length;
                    isPlayed = barPosition <= progress;
                }

                return (
                    <div
                        key={`${flip ? 'bottom' : 'top'}-${idx}`}
                        className={styles.bar_item}
                        style={{
                            height: Math.max(val * height, minHeight),
                            background: isPlayed ? '#0098ea' : '#797979ff',
                        }}
                    />
                );
            })}
        </div>
    );
});
