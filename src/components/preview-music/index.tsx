import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { PropsType } from './props.type.ts';
import styles from './index.module.css';
import { useFileSize } from '../../common/hooks/use-file-size.ts';
import { MdDeleteOutline } from 'react-icons/md';
import { ContextMedia } from '../preview-media-context';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import * as mm from 'music-metadata-browser';

export const PreviewMusic: FC<PropsType> = ({ file, number }) => {
    const size = useFileSize(file.size);
    const { setFiles, files } = useContext(ContextMedia)!;
    const [fileName, setFileName] = useState(file.name);
    const [url, setUrl] = useState<string>();

    const getInfo = useCallback(async () => {
        const arrayBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        const metadata = await mm.parseBuffer(uint8, file.type, { duration: true });
        const title = metadata.common.title;
        const artist = metadata.common.artist;

        let fileName = '';

        if (title?.length) fileName = title;
        if (artist?.length) {
            if (title) fileName += ' - ';
            fileName += artist;
        }
        if (fileName?.length) setFileName(fileName);

        if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            const blob = new Blob([picture.data], { type: picture.format });
            setUrl(URL.createObjectURL(blob));
        }
    }, [file]);

    useEffect(() => {
        getInfo();
    }, [getInfo]);

    const deleteFile = useCallback(() => {
        if (!files) return;
        const dataTransfer = new DataTransfer();

        Array.from(files).forEach((file, index) => {
            if (index !== number) dataTransfer.items.add(file);
        });

        const fileList: FileList = dataTransfer.files;
        setFiles(fileList);
    }, [files, number]);

    return (
        <div className={styles.background}>
            <div>
                {url && <img src={url} className={styles.file_preview_image} />}
                {!url && (
                    <div className={styles.file_logo_background}>
                        <IoMusicalNotesSharp className={styles.file_logo} />
                    </div>
                )}
            </div>
            <div className={`${styles.file_inf} text_translate`}>
                <div className={styles.file_name}>{fileName}</div>
                <div className={styles.file_size}>{size}</div>
            </div>
            <div className={styles.styles_background} onClick={deleteFile}>
                <MdDeleteOutline className={styles.logo_delete} />
            </div>
        </div>
    );
};
