import { FC, memo, useContext, useEffect } from 'react';
import { audioMusic, AudioPlayerContext, audioVoice } from '../index.tsx';
import image from '../../../../../public/assets/icons/256.png';
import json from '../../../../../package.json';
import { FileExtensionEnum } from '../../../types/files/types.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { useTranslation } from 'react-i18next';

export const UpdateMediaSession: FC<{ children: any }> = memo(({ children }) => {
    const { t } = useTranslation();
    const { audio, play, pause } = useContext(AudioPlayerContext)!;

    useEffect(() => {
        if ('mediaSession' in navigator) {
            if (!audio) return;
            const { file } = audio;
            let artwork = [{ src: image, sizes: '512x512', type: 'image/png' }];
            let title = file.originalName;
            let artist = json.name;

            if (file.metadata.title) title = file.metadata.title;
            else if (file.fileType === FileExtensionEnum.IS_VOICE) title = t('voice_message');

            if (file.metadata.artist) artist = file.metadata.artist;

            if (file.metadata.previewId)
                artwork = [
                    {
                        src: `${Envs.filesServiceUrl}/${file.chatId}/${file.metadata.previewId}`,
                        sizes: '512x512',
                        type: file.metadata.previewMimeType as string,
                    },
                ];

            navigator.mediaSession.metadata = new MediaMetadata({
                title,
                artist,
                album: file.metadata.album,
                artwork,
            });

            navigator.mediaSession.setActionHandler('play', play);
            navigator.mediaSession.setActionHandler('pause', pause);

            navigator.mediaSession.setActionHandler('seekto', (details) => {
                const audioElement: HTMLAudioElement | null = audioVoice ?? audioMusic;

                if (!audioElement) return;
                const originalVolume = audioElement.volume;
                const wasPaused = audioElement.paused;
                if (wasPaused) {
                    audioElement.volume = 0;
                    audioElement?.play().then(() => {
                        audioElement!.currentTime = details.seekTime!;
                        if (wasPaused) audioElement!.pause();
                        audioElement!.volume = originalVolume;
                    });
                } else audioElement.currentTime = details.seekTime!;
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                const audioElement: HTMLAudioElement | null = audioVoice ?? audioMusic;
                if (audioElement) audioElement.currentTime = 0;

                console.log('⬅️ предыдущая');
                // switchToPreviousTrack();
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                console.log('➡️ следующая');
                // switchToNextTrack();
            });
        }
    }, [audio]);

    return children;
});
