import { Types } from '../../root/types/files/types.ts';

export const CanPlayAudio = (file: Types): boolean => {
    const audio = document.createElement('audio');
    return audio.canPlayType(file.mimeType) !== '';
};
