export type FileMetadataType = {
    duration?: number;
    loudnessData?: number[];

    previewId?: string;
    previewMimeType?: MimetypeEnum;
    previewSize?: number;

    artist?: string;
    title?: string;
    album?: string;
    year?: number;

    // null         never gave a text
    // undefined    wait for create text
    transcriptionVoice?: string | null;
};

export interface FilesType extends File {
    metaData?: FileMetadataType;
    randomId?: string;
}

export type Types = {
    id: string;
    key: string;
    chatId: string;
    messageId: string;
    originalName: string;
    mimeType: MimetypeEnum;
    size: number;
    createdAt: Date;
    fileType: FileExtensionEnum;
    metadata: FileMetadataType;

    cachedTime?: number;
};

export type UploadResultType = {
    fileId: string;
};

export enum FileTypeEnum {
    VIDEO = 'video',
    IMAGE = 'image',
    AUDIO = 'audio',
    VPN = 'vpn',
}

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
    JPEG = 'image/jpeg',
    JPG = 'image/jpg',
    PNG = 'image/png',
    GIF = 'image/gif',
    WebP = 'image/webp',
    BMP = 'image/bmp',
    TIFF = 'image/tiff',
    SVG = 'image/svg+xml',

    // Видео
    MP4 = 'video/mp4',
    WebM = 'video/webm',
    AVI = 'video/x-msvideo',
    MOV = 'video/quicktime',
    MKV = 'video/x-matroska',
    WMV = 'video/x-ms-wmv',
    FLV = 'video/x-flv',

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
    [
        'IMAGE',
        [
            MimetypeEnum.JPEG,
            MimetypeEnum.JPG,
            MimetypeEnum.PNG,
            MimetypeEnum.GIF,
            MimetypeEnum.WebP,
            MimetypeEnum.BMP,
            MimetypeEnum.TIFF,
            MimetypeEnum.SVG,
        ],
    ],
    [
        'VIDEO',
        [
            MimetypeEnum.MP4,
            MimetypeEnum.WebM,
            MimetypeEnum.AVI,
            MimetypeEnum.MOV,
            MimetypeEnum.MKV,
            MimetypeEnum.WMV,
            MimetypeEnum.FLV,
        ],
    ],
]);

export const MimeToExt = new Map<string, string>([
    // --- AUDIO ---
    ['audio/aac', 'aac'],
    ['audio/midi', 'midi'],
    ['audio/x-midi', 'midi'],
    ['audio/mpeg', 'mp3'],
    ['audio/ogg', 'ogg'],
    ['audio/opus', 'opus'],
    ['audio/wav', 'wav'],
    ['audio/webm', 'weba'],
    ['audio/3gpp', '3gp'],
    ['audio/3gpp2', '3g2'],
    ['audio/flac', 'flac'],
    ['audio/x-flac', 'flac'],

    // --- VIDEO ---
    ['video/x-msvideo', 'avi'],
    ['video/mp4', 'mp4'],
    ['video/mpeg', 'mpeg'],
    ['video/ogg', 'ogv'],
    ['video/webm', 'webm'],
    ['video/3gpp', '3gp'],
    ['video/3gpp2', '3g2'],
    ['video/x-matroska', 'mkv'],
    ['video/quicktime', 'mov'],

    // --- IMAGE ---
    ['image/avif', 'avif'],
    ['image/bmp', 'bmp'],
    ['image/gif', 'gif'],
    ['image/jpeg', 'jpeg'],
    ['image/png', 'png'],
    ['image/svg+xml', 'svg'],
    ['image/tiff', 'tiff'],
    ['image/webp', 'webp'],
    ['image/x-icon', 'ico'],
    ['image/heic', 'heic'],
    ['image/heif', 'heif'],

    // --- DOCUMENTS ---
    ['application/pdf', 'pdf'],
    ['application/json', 'json'],
    ['application/ld+json', 'json'],
    ['application/msword', 'doc'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'],
    ['application/vnd.ms-excel', 'xls'],
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx'],
    ['application/vnd.ms-powerpoint', 'ppt'],
    ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'pptx'],
    ['application/zip', 'zip'],
    ['application/gzip', 'gz'],
    ['application/x-7z-compressed', '7z'],
    ['application/x-rar-compressed', 'rar'],
    ['application/x-tar', 'tar'],
    ['application/x-bzip', 'bz'],
    ['application/x-bzip2', 'bz2'],
    ['application/x-sh', 'sh'],
    ['application/x-httpd-php', 'php'],
    ['application/x-python-code', 'pyc'],
    ['application/javascript', 'js'],
    ['application/x-javascript', 'js'],
    ['application/ecmascript', 'js'],
    ['application/sql', 'sql'],
    ['application/xml', 'xml'],
    ['application/x-yaml', 'yaml'],
    ['application/x-font-ttf', 'ttf'],
    ['application/x-font-woff', 'woff'],
    ['application/font-woff', 'woff'],
    ['application/font-woff2', 'woff2'],
    ['application/vnd.font-fontawesome', 'woff'],
    ['application/octet-stream', 'bin'],

    // --- TEXT ---
    ['text/plain', 'txt'],
    ['text/css', 'css'],
    ['text/csv', 'csv'],
    ['text/html', 'html'],
    ['text/xml', 'xml'],
    ['text/markdown', 'md'],
    ['text/javascript', 'js'],
    ['text/x-python', 'py'],
    ['text/x-c', 'c'],
    ['text/x-c++', 'cpp'],
    ['text/x-java-source', 'java'],
    ['text/x-shellscript', 'sh'],
    ['text/x-typescript', 'ts'],
    ['text/x-sql', 'sql'],
    ['text/x-yaml', 'yaml'],
    ['text/x-php', 'php'],
    ['text/x-go', 'go'],
    ['text/x-kotlin', 'kt'],

    // --- FONTS ---
    ['font/otf', 'otf'],
    ['font/ttf', 'ttf'],
    ['font/woff', 'woff'],
    ['font/woff2', 'woff2'],

    // --- ARCHIVES & EXECUTABLES ---
    ['application/x-iso9660-image', 'iso'],
    ['application/x-img', 'img'],
    ['application/x-msdownload', 'exe'],
    ['application/x-executable', 'bin'],
    ['application/vnd.android.package-archive', 'apk'],
    ['application/x-deb', 'deb'],
    ['application/x-rpm', 'rpm'],
    ['application/x-msinstaller', 'msi'],
    ['application/x-appimage', 'appimage'],
    ['application/x-cpio', 'cpio'],
    ['application/x-apple-diskimage', 'dmg'],
    ['application/x-vhd', 'vhd'],
    ['application/x-vmdk', 'vmdk'],
]);
