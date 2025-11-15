import { FileMap, FileMetadataType, FilesType, MimetypeEnum } from '../../root/types/files/types.ts';
import * as mm from 'music-metadata-browser';
import { FilesService } from '../services/files.service.ts';

export const getFilesWithMetadata = async (files: FilesType[]): Promise<FilesType[]> => {
    const data = await Promise.all(
        files.map(async (file) => {
            file.randomId = window.crypto.randomUUID();
            const metadata: FileMetadataType = {};
            // обработка MP3
            if (FileMap.get('MP3')?.find((type) => type === file.type)) {
                const arrayBuffer = await file.arrayBuffer();
                const uint8 = new Uint8Array(arrayBuffer);
                const metadataMp3 = await mm.parseBuffer(uint8, file.type, { duration: true });
                const title = metadataMp3.common.title;
                const artist = metadataMp3.common.artist;
                const album = metadataMp3.common.album;

                metadata.title = title?.length ? title : undefined;
                metadata.artist = artist?.length ? artist : undefined;
                metadata.album = album?.length ? album : undefined;
                metadata.year = metadataMp3.common.year ? metadataMp3.common.year : undefined;

                if (metadataMp3.common.picture && metadataMp3.common.picture.length > 0) {
                    const picture = metadataMp3.common.picture[0];

                    const newFile = new File([picture.data], 'preview', { type: picture.format });
                    const previewFile = await FilesService.resizeImage(newFile, 512, 512);

                    metadata.previewId = URL.createObjectURL(previewFile);
                    metadata.previewMimeType = previewFile.type as MimetypeEnum;
                    metadata.previewSize = previewFile.size;
                }

                let fileName = '';

                if (title?.length) fileName = title;
                if (artist?.length) {
                    if (title) fileName += ' - ';
                    fileName += artist;
                }

                if (fileName.length) file = new File([await file.arrayBuffer()], fileName, { type: file.type });
            }
            // обработка изображений
            if (FileMap.get('IMAGE')?.find((type) => type === file.type)) {
                const previewFile = await FilesService.resizeImage(file);

                metadata.previewId = URL.createObjectURL(previewFile);
                metadata.previewMimeType = previewFile.type as MimetypeEnum;
                metadata.previewSize = previewFile.size;
            }
            // обработка видео
            if (FileMap.get('VIDEO')?.find((type) => type === file.type)) {
                const previewFile = await FilesService.getVideoPreview(file);

                metadata.previewId = URL.createObjectURL(previewFile);
                metadata.previewMimeType = previewFile.type as MimetypeEnum;
                metadata.previewSize = previewFile.size;
            }

            if (Object.keys(metadata)?.length) file.metaData = metadata;

            return file;
        }),
    );

    data.forEach((file) => (file.randomId = window.crypto.randomUUID()));
    return data;
};
