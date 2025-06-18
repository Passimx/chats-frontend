export type AudioType = {
    id: string;
    blob: Blob;
};

export type ContextType = {
    setAudio: (value: AudioType) => void;
    play: () => Promise<null>;
    pause: () => void;
};
