export type FileType = {
    id: string;
    originalName: string;
    mimeType: MimetypeEnum;
    size: number;
    createdAt: Date;
};

export enum MimetypeEnum {
    'AUDIO_WAV' = 'audio/wav',
}
