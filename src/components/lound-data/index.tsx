import { FC, memo, useCallback, useContext, useMemo, useRef } from 'react';
import { useAppSelector } from '../../root/store';
import { Bars } from './components/bars';
import { PropsType } from './types.ts';
import { AudioPlayerContext } from '../../root/contexts/audio-player';

export const LoudnessBars: FC<PropsType> = memo(({ file }) => {
    const loudnessData = file?.metadata?.loudnessData ?? [];

    const { seek, audio } = useContext(AudioPlayerContext)!;
    const barRef = useRef<HTMLDivElement>(null);
    const { isPhone } = useAppSelector((state) => state.app);

    // вычисляем сколько элементов из loudnessData использовать
    const displayData = useMemo(() => {
        const barsCount = isPhone ? 60 : 100;
        if (barsCount >= loudnessData.length) return loudnessData;
        const step = loudnessData.length / barsCount;
        return Array.from({ length: barsCount }, (_, i) => loudnessData[Math.floor(i * step)]);
    }, [loudnessData, isPhone]);

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
            <Bars flip={true} displayData={displayData} fileId={file.id} />
        </div>
    );
});
