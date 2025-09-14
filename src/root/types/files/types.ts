export type Types = {
    id: string;
    originalName: string;
    mimeType: MimetypeEnum;
    size: number;
    createdAt: Date;
    fileType: FileExtensionEnum;
};

export enum MimetypeEnum {
    // Текст / Документы
    PDF = 'application/pdf',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    DOC = 'application/msword',
    XLS = 'application/vnd.ms-excel',
    PPT = 'application/vnd.ms-powerpoint',
    PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Архивы
    ZIP = 'application/zip',
    RAR = 'application/vnd.rar',
    TAR = 'application/x-tar',
    GZ = 'application/gzip',

    // Конфигурационные
    OVPN = 'application/x-openvpn-profile',
    YML = 'application/x-yaml',
    BINARY = 'application/octet-stream',

    // Фото
    // JPEG = 'image/jpeg',
    // JPG = 'image/jpg',
    // PNG = 'image/png',
    // GIF = 'image/gif',
    // WebP = 'image/webp',
    // BMP = 'image/bmp',
    // TIFF = 'image/tiff',
    // SVG = 'image/svg+xml',

    // Видео
    // MP4 = 'video/mp4',
    // WebM = 'video/webm',
    // AVI = 'video/x-msvideo',
    // MOV = 'video/quicktime',
    // MKV = 'video/x-matroska',
    // WMV = 'video/x-ms-wmv',
    // FLV = 'video/x-flv',

    // Звук
    MP3 = 'audio/mpeg',
    WAV = 'audio/wav',
    OGG = 'audio/ogg',
    FLAC = 'audio/flac',
    AAC = 'audio/aac',
    M4A = 'audio/x-m4a',
    Opus = 'audio/opus',
    // не воспроизводится в браузере
    // AMR = 'audio/amr',

    // Текстовые форматы
    JSON = 'application/json',
    XML = 'application/xml',
    CSV = 'text/csv',
    TXT = 'text/plain',

    // Веб-файлы
    HTML = 'text/html',
    CSS = 'text/css',
    JS = 'application/javascript',
    TS = 'application/typescript',
    JSX = 'text/jsx',
    TSX = 'text/tsx',

    // Сценарии / Скрипты
    SH = 'application/x-sh',
    BAT = 'application/x-bat',
}

export enum FileExtensionEnum {
    IS_VOICE = 'is_voice',
    IS_MEDIA = 'is_media',
}

export const FileMap = new Map<string, MimetypeEnum[]>([
    ['ZIP', [MimetypeEnum.ZIP, MimetypeEnum.RAR, MimetypeEnum.TAR, MimetypeEnum.GZ]],
    ['SH', [MimetypeEnum.SH, MimetypeEnum.BAT]],
    ['PPT', [MimetypeEnum.PPT, MimetypeEnum.PPTX]],
    [
        'MP3',
        [
            MimetypeEnum.MP3,
            MimetypeEnum.WAV,
            MimetypeEnum.OGG,
            MimetypeEnum.FLAC,
            MimetypeEnum.AAC,
            MimetypeEnum.M4A,
            // MimetypeEnum.AMR,
            MimetypeEnum.Opus,
        ],
    ],
    // [
    //     'IMAGE',
    //     [
    //         MimetypeEnum.JPEG,
    //         MimetypeEnum.JPG,
    //         MimetypeEnum.PNG,
    //         MimetypeEnum.GIF,
    //         MimetypeEnum.WebP,
    //         MimetypeEnum.BMP,
    //         MimetypeEnum.TIFF,
    //         MimetypeEnum.SVG,
    //     ],
    // ],
]);
