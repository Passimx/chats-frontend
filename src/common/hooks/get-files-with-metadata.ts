import { FileMap, FilesType, MimetypeEnum } from '../../root/types/files/types.ts';
import * as mm from 'music-metadata-browser';

export const getFilesWithMetadata = async (files: FilesType[]): Promise<FilesType[]> => {
    const data = await Promise.all(
        files.map(async (file) => {
            // обработка MP3
            if (FileMap.get('MP3')?.find((type) => type === file.type)) {
                const arrayBuffer = await file.arrayBuffer();
                const uint8 = new Uint8Array(arrayBuffer);
                const metadata = await mm.parseBuffer(uint8, file.type, { duration: true });

                const title = metadata.common.title;
                const artist = metadata.common.artist;
                const album = metadata.common.album;
                const year = metadata.common.year;
                let previewId = undefined;
                let previewMimeType = undefined;

                if (metadata.common.picture && metadata.common.picture.length > 0) {
                    const picture = metadata.common.picture[0];
                    const blob = new Blob([picture.data], { type: picture.format });
                    previewId = URL.createObjectURL(blob);
                    previewMimeType = picture.format as MimetypeEnum;
                }

                let fileName = '';

                if (title?.length) fileName = title;
                if (artist?.length) {
                    if (title) fileName += ' - ';
                    fileName += artist;
                }

                if (fileName.length) file = new File([await file.arrayBuffer()], fileName, { type: file.type });

                file.metaData = {
                    previewId,
                    previewMimeType,
                    artist: artist?.length ? artist : undefined,
                    title: title?.length ? title : undefined,
                    year: year ? year : undefined,
                    album: album?.length ? album : undefined,
                };
            }

            return file;
        }),
    );

    return data;
};
