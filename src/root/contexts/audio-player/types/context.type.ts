import { Types } from '../../../types/files/types.ts';

export type AudioType = {
    file: Types;
    blob: Blob;
};

export type ContextType = {
    audio?: AudioType;
    isPlaying: boolean;
    progress?: number;

    addFile: (value: AudioType) => void;
    play: () => Promise<void>;
    pause: () => void;
    seek: (value: number) => void;
};
