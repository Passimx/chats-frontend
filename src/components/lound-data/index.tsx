import { FC, memo, useCallback, useContext, useMemo, useRef } from 'react';
import { Bars } from './components/bars';
import { PropsType } from './types.ts';
import { AudioPlayerContext } from '../../root/contexts/audio-player';

export const LoudnessBars: FC<PropsType> = memo(({ file }) => {
    const loudnessData = file?.metadata?.loudnessData ?? [];
    const durationAudio = file?.metadata?.duration;
    const { seek, audio } = useContext(AudioPlayerContext)!;
    const barRef = useRef<HTMLDivElement>(null);

    // вычисляем сколько элементов из loudnessData использовать
    const displayData = useMemo(() => {
        // Базовое количество баров
        const baseBarsCount = 10;

        // Корректируем количества в зависимости от длительности- файла
        let barsCount = baseBarsCount;

        if (durationAudio) {
            if (durationAudio < 14) {
                barsCount = baseBarsCount;
            } else if (durationAudio < 60) {
                barsCount = Math.floor(baseBarsCount * 2);
            } else if (durationAudio < 300) {
                // 1-5 минут
                barsCount = Math.floor(baseBarsCount * 4);
            } else if (durationAudio < 900) {
                // 5-15 минут
                barsCount = Math.floor(baseBarsCount * 6);
            } else if (durationAudio < 1800) {
                // 15-30 минут
                barsCount = Math.floor(baseBarsCount * 8); //
            }
        }

        if (barsCount >= loudnessData.length) return loudnessData;
        const step = loudnessData.length / barsCount;
        return Array.from({ length: barsCount }, (_, i) => loudnessData[Math.floor(i * step)]);
    }, [loudnessData, durationAudio]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (!barRef.current) return;
            if (audio?.file.id !== file.id) return;

            const rect = barRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = clickX / rect.width;
            seek(percent);
        },
        [file, audio, barRef],
    );

    return (
        <div ref={barRef} onClick={handleClick}>
            <Bars flip={false} displayData={displayData} fileId={file.id} />
        </div>
    );
});
