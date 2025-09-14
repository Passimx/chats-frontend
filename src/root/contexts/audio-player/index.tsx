import { createContext, FC, memo, ReactElement, useCallback, useEffect, useState } from 'react';
import { AudioType, ContextType } from './types/context.type.ts';
import { useFileSize } from '../../../common/hooks/use-file-size.ts';

export const AudioPlayerContext = createContext<ContextType | null>(null);
// let audioInside: AudioType;
// let context: AudioBufferSourceNode;

let audioEl: HTMLAudioElement | null = null;

export const AudioPlayer: FC<{ children: ReactElement }> = memo(({ children }) => {
    const [audio, setAudio] = useState<AudioType>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const getFileSize = useFileSize;

    const play = async () => {
        setIsPlaying(true);
    };

    const pause = useCallback(() => setIsPlaying(false), []);

    const timeupdate = useCallback(() => {
        //     const current = audioEl.currentTime; // сколько секунд прошло
        //     const total = audioEl.duration; // общая длительность
        //
        //     const progress = (current / total) * 100; // прогресс в процентах
        //     console.log('Прогресс:', progress);
    }, []);

    const addFile = useCallback(
        (value: AudioType) => {
            if (value.file.id && value.file.id !== audio?.file.id) {
                audioEl?.pause();
                audioEl?.removeEventListener('ended', pause);
                audioEl?.removeEventListener('timeupdate', timeupdate);
                audioEl = null;

                const url = URL.createObjectURL(value.blob);
                audioEl = new Audio(url);

                audioEl.addEventListener('ended', pause);
                audioEl.addEventListener('timeupdate', timeupdate);

                if ('mediaSession' in navigator) {
                    const size = getFileSize(audio?.file?.size);

                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: audio?.file.originalName,
                        artist: size,
                        artwork: [{ src: '/assets/icons/512.png', sizes: '512x512', type: 'image/png' }],
                    });

                    navigator.mediaSession.setActionHandler('play', () => audioEl?.play());
                    navigator.mediaSession.setActionHandler('pause', () => audioEl?.pause());

                    navigator.mediaSession.setActionHandler('seekto', (details) => {
                        if (audioEl && details.seekTime != null) {
                            audioEl.currentTime = details.seekTime;
                        }
                    });

                    navigator.mediaSession.setActionHandler('previoustrack', () => {
                        if (audioEl) audioEl.currentTime = 0;

                        console.log('⬅️ предыдущая');
                        // switchToPreviousTrack();
                    });

                    navigator.mediaSession.setActionHandler('nexttrack', () => {
                        console.log('➡️ следующая');
                        // switchToNextTrack();
                    });
                }
            }

            setAudio(value);
        },
        [audio],
    );

    useEffect(() => {
        if (isPlaying && audio) {
            audioEl?.play();
        }

        if (!isPlaying && audio) {
            audioEl?.pause();
        }
    }, [isPlaying, audio]);

    return (
        <AudioPlayerContext.Provider value={{ audio, isPlaying, addFile, play, pause }}>
            <>{children}</>
        </AudioPlayerContext.Provider>
    );
});
