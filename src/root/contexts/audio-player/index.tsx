import { createContext, FC, memo, ReactElement, useCallback, useEffect, useState } from 'react';
import { AudioType, ContextType } from './types/context.type.ts';
import { FileExtensionEnum } from '../../types/files/types.ts';
import image from '../../../../public/assets/icons/512.png';
import { useTranslation } from 'react-i18next';
import json from '../../../../package.json';

export const AudioPlayerContext = createContext<ContextType | null>(null);

let audioEl: HTMLAudioElement | null = null;

export const AudioPlayer: FC<{ children: ReactElement }> = memo(({ children }) => {
    const [audio, setAudio] = useState<AudioType>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>();
    const { t } = useTranslation();

    const play = async () => {
        setIsPlaying(true);
    };

    const pause = useCallback(() => setIsPlaying(false), []);

    const timeupdate = useCallback(() => {
        if (!audioEl) return;
        const current = audioEl.currentTime;
        const total = audioEl.duration;

        const progress = current / total;
        if (progress == 1) {
            setProgress(undefined);
            setAudio(undefined);
        } else setProgress(progress);
    }, []);

    const seek = useCallback((progress: number) => {
        console.log([audioEl?.duration]);
        if (!audioEl) return;
        audioEl.currentTime = audioEl.duration * progress;
    }, []);

    const addFile = useCallback(
        (value: AudioType) => {
            if (value.file.id && value.file.id !== audio?.file.id) {
                setAudio(value);
                setProgress(undefined);
                audioEl?.pause();
                audioEl?.removeEventListener('ended', pause);
                audioEl?.removeEventListener('timeupdate', timeupdate);
                audioEl = null;

                const url = URL.createObjectURL(value.blob);
                audioEl = new Audio(url);

                audioEl.addEventListener('ended', pause);
                audioEl.addEventListener('timeupdate', timeupdate);

                if ('mediaSession' in navigator) {
                    const title =
                        value.file.fileType === FileExtensionEnum.IS_VOICE
                            ? t('voice_message')
                            : value?.file.originalName;

                    navigator.mediaSession.metadata = new MediaMetadata({
                        title,
                        artist: json.name,
                        artwork: [{ src: image, sizes: '512x512', type: 'image/png' }],
                    });

                    navigator.mediaSession.setActionHandler('play', play);
                    navigator.mediaSession.setActionHandler('pause', pause);

                    navigator.mediaSession.setActionHandler('seekto', (details) => {
                        if (!audioEl) return;
                        const originalVolume = audioEl.volume;
                        const wasPaused = audioEl.paused;
                        if (wasPaused) {
                            audioEl.volume = 0;
                            audioEl?.play().then(() => {
                                audioEl!.currentTime = details.seekTime!;
                                if (wasPaused) audioEl!.pause();
                                audioEl!.volume = originalVolume;
                            });
                        } else audioEl.currentTime = details.seekTime!;
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
        },
        [audio],
    );

    useEffect(() => {
        if (isPlaying && audio) {
            audioEl?.play().catch(() => setIsPlaying(false));
        }

        if (!isPlaying && audio) {
            audioEl?.pause();
        }
    }, [isPlaying, audio]);

    return (
        <AudioPlayerContext.Provider value={{ audio, isPlaying, progress, addFile, play, pause, seek }}>
            <>{children}</>
        </AudioPlayerContext.Provider>
    );
});
