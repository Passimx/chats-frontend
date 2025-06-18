import { createContext, FC, memo, ReactElement, useCallback } from 'react';
import { AudioType, ContextType } from './types/context.type.ts';

export const AudioPlayerContext = createContext<ContextType | null>(null);
let audio: AudioType;
let context: AudioBufferSourceNode;
let offset: number;

export const AudioPlayer: FC<{ children: ReactElement }> = memo(({ children }) => {
    const play: () => Promise<null> = () =>
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve) => {
            const fileId = audio.id;
            if (context) context.stop();
            if (!audio?.blob) return resolve(null);

            const arrayBuffer = await audio.blob.arrayBuffer();
            const audioContext = new window.AudioContext();
            const source = audioContext.createBufferSource();

            source.buffer = await audioContext.decodeAudioData(arrayBuffer);
            source.connect(audioContext.destination);
            if (source.buffer?.duration - 0.1 < offset) offset = 0;
            source.start(0, offset);
            const begin = Date.now() - (offset ?? 0) * 1000;
            context = source;

            context.onended = () => {
                const end = Date.now();
                const currentTime = context.context.currentTime;
                const duration = source.buffer?.duration ?? 0 - 0.1;

                if ((duration && currentTime > duration) || fileId !== audio.id) offset = 0;
                else offset = (end - begin) / 1000;

                resolve(null);
            };
        });

    const pause = useCallback(() => {
        if (!context) return;
        context.stop();
    }, []);

    const setAudio = useCallback((value: AudioType) => {
        if (audio?.id !== value?.id) offset = 0;
        audio = value;
    }, []);

    return (
        <AudioPlayerContext.Provider value={{ setAudio, play, pause }}>
            <>{children}</>
        </AudioPlayerContext.Provider>
    );
});
