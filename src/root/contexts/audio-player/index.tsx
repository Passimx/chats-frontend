import { createContext, FC, memo, ReactElement, useCallback, useEffect, useState } from 'react';
import { AudioType, ContextType } from './types/context.type.ts';
import { FileExtensionEnum, FileMap } from '../../types/files/types.ts';
import { UpdateMediaSession } from './components/update-media-session.hook.tsx';

export const AudioPlayerContext = createContext<ContextType | null>(null);

let audioFile: AudioType | null = null;
export let audioMusic: HTMLAudioElement | null = null;
export let audioVoice: HTMLAudioElement | null = null;

export const AudioPlayer: FC<{ children: ReactElement }> = memo(({ children }) => {
    const [audio, setAudio] = useState<AudioType>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>();

    const play = async () => {
        setIsPlaying(true);
    };

    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const ended = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const endedVoice = useCallback(() => {
        audioVoice = null;

        if (audioFile) {
            setAudio(audioFile);
            audioMusic?.play();
        } else setIsPlaying(false);
    }, []);

    const timeupdate = useCallback(() => {
        const audioElement: HTMLAudioElement | null = audioVoice ?? audioMusic;

        if (!audioElement) return;
        const current = audioElement.currentTime;
        const total = audioElement.duration;

        const progress = current / total;
        if (progress == 1) {
            setProgress(undefined);
        } else setProgress(progress);
    }, []);

    const seek = useCallback((progress: number) => {
        const audioElement: HTMLAudioElement | null = audioVoice ?? audioMusic;

        if (!audioElement) return;
        audioElement.currentTime = audioElement.duration * progress;
    }, []);

    const addFile = useCallback(
        (value: AudioType) => {
            if (value.file.id && value.file.id !== audio?.file.id) {
                setAudio(value);
                setProgress(undefined);
                audioMusic?.pause();
                audioVoice?.pause();
                const element: HTMLAudioElement = new Audio(URL.createObjectURL(value.blob));

                if (value.file.fileType === FileExtensionEnum.IS_VOICE) {
                    audioVoice = element;
                    audioVoice.addEventListener('ended', endedVoice);
                } else {
                    element.loop = true;
                    audioMusic = element;
                    audioMusic.addEventListener('ended', ended);
                }

                element.addEventListener('timeupdate', timeupdate);
            }
        },
        [audio],
    );

    useEffect(() => {
        const audioElement: HTMLAudioElement | null = audioVoice ?? audioMusic;
        if (!audioElement) return;

        if (isPlaying) audioElement.play().catch(() => setIsPlaying(false));
        if (!isPlaying) audioElement.pause();
    }, [isPlaying, audio]);

    /** сохранение музыки в кеше */
    /** На случай после голосового вернуть mp3 */
    useEffect(() => {
        if (!audio) return;
        if (FileMap.get('MP3')?.includes(audio?.file.mimeType) && audio.file.fileType === FileExtensionEnum.IS_MEDIA)
            audioFile = audio;
    }, [audio]);

    return (
        <AudioPlayerContext.Provider value={{ audio, isPlaying, progress, addFile, play, pause, seek }}>
            <UpdateMediaSession>{children}</UpdateMediaSession>
        </AudioPlayerContext.Provider>
    );
});
