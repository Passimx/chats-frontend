export type FileType = {
    id: string;
    originalName: string;
    mimeType: MimetypeEnum;
    size: number;
    createdAt: Date;
    fileType: FileExtensionEnum;
};

export enum MimetypeEnum {
    AUDIO_WAV = 'audio/wav',
}

enum FileExtensionEnum {
    IS_VOICE = 'is_voice',
    IS_MEDIA = 'is_media',
}
