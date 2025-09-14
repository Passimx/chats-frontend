import { createContext, FC, memo, ReactElement, useCallback, useState } from 'react';
import { AudioType, ContextType } from './types/context.type.ts';

export const AudioPlayerContext = createContext<ContextType | null>(null);
let audioInside: AudioType;
let context: AudioBufferSourceNode;
let offset: number;

export const AudioPlayer: FC<{ children: ReactElement }> = memo(({ children }) => {
    const [audio, setAudio] = useState<AudioType>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const play: () => Promise<void> = () =>
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve) => {
            const fileId = audioInside.file.id;
            if (context) context.stop();
            if (!audioInside?.blob) return resolve();

            const arrayBuffer = await audioInside.blob.arrayBuffer();
            const audioContext = new window.AudioContext();
            const source = audioContext.createBufferSource();

            source.buffer = await audioContext.decodeAudioData(arrayBuffer);
            source.connect(audioContext.destination);

            if (source.buffer?.duration - 0.1 < offset) offset = 0;
            source.start(0, offset);
            setIsPlaying(true);
            const begin = Date.now() - (offset ?? 0) * 1000;
            context = source;

            context.onended = () => {
                const end = Date.now();
                const currentTime = context.context.currentTime;
                const duration = source.buffer?.duration ?? 0 - 0.1;

                if ((duration && currentTime > duration) || fileId !== audioInside?.file?.id) {
                    setIsPlaying(false);
                    offset = 0;
                } else offset = (end - begin) / 1000;

                resolve();
            };
        });

    const pause = useCallback(() => {
        if (!context) return;
        context.stop();
        setIsPlaying(false);
    }, []);

    const addFile = useCallback((value: AudioType) => {
        if (audio?.file?.id !== value?.file?.id) offset = 0;
        audioInside = value;
        setAudio(value);
    }, []);

    return (
        <AudioPlayerContext.Provider value={{ audio, isPlaying, addFile, play, pause }}>
            <>{children}</>
        </AudioPlayerContext.Provider>
    );
});
