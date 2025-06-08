export type FileType = {
    id: string;
    path: string;
    mimetype: MimetypeEnum;
};

export enum MimetypeEnum {
    'AUDIO_WAV' = 'audio/wav',
}
