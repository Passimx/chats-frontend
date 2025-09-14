import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { PropsType } from './props.type.ts';
import styles from './index.module.css';
import { useFileSize } from '../../common/hooks/use-file-size.ts';
import { CiFileOn } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { ContextMedia } from '../preview-media-context';
import { TbBrandOpenvpn } from 'react-icons/tb';
import { IoMusicalNotesSharp } from 'react-icons/io5';

enum FileTypeEnum {
    VIDEO = 'video',
    IMAGE = 'image',
    AUDIO = 'audio',
    VPN = 'vpn',
}

// async function getAudioLevels(file: File, segments = 60): Promise<void> {
//     if (file.type !== FileTypeEnum.AUDIO) return;
//     const arrayBuffer = await file.arrayBuffer();
//
//     const audioCtx = new AudioContext();
//     const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
//
//     const channelData = audioBuffer.getChannelData(0); // берём первый канал
//     const samplesPerSegment = Math.floor(channelData.length / segments);
//
//     const levels: number[] = [];
//
//     for (let i = 0; i < segments; i++) {
//         const start = i * samplesPerSegment;
//         const end = start + samplesPerSegment;
//         const slice = channelData.subarray(start, end);
//
//         // RMS для сегмента
//         let sumSquares = 0;
//         for (let j = 0; j < slice.length; j++) {
//             sumSquares += slice[j] * slice[j];
//         }
//         const rms = Math.sqrt(sumSquares / slice.length);
//
//         // Переводим в дБFS (отрицательное число, ближе к 0 = громче)
//         const db = 20 * Math.log10(rms);
//
//         // Для удобства нормализуем в 0..1
//         const normalized = Math.max(0, (db + 100) / 100);
//         levels.push(normalized);
//     }
//     console.log(levels);
// }

export const PreviewFile: FC<PropsType> = ({ file, number }) => {
    const size = useFileSize(file.size);
    const [url, setUrl] = useState<string>('');
    const [type, setType] = useState<FileTypeEnum>();
    const { setFiles, files } = useContext(ContextMedia)!;
    //
    // useEffect(() => {
    //     if (!file) return;
    //
    //     const audio = new Audio();
    //     audio.src = URL.createObjectURL(file);
    //
    //     const handler = () => {
    //         console.log('Длительность:', audio.duration, 'секунд');
    //         URL.revokeObjectURL(audio.src); // очищаем, чтобы не было утечек памяти
    //     };
    //
    //     audio.addEventListener('loadedmetadata', handler);
    //     audio.play();
    //
    //     getAudioLevels(file);
    //
    //     return () => {
    //         audio.removeEventListener('loadedmetadata', handler);
    //     };
    // }, [file]);

    useEffect(() => {
        const url = URL.createObjectURL(file);

        if (file.type.includes(FileTypeEnum.IMAGE)) {
            const element: HTMLImageElement = document.createElement('img');
            element.src = url;
            element.onload = () => {
                setType(FileTypeEnum.IMAGE);
                setUrl(url);
            };
        } else if (file.type.includes(FileTypeEnum.VIDEO)) {
            const element: HTMLVideoElement = document.createElement('video');
            element.src = url;
            element.onloadeddata = () => {
                setUrl(url);
                setType(FileTypeEnum.VIDEO);
            };
        } else if (file.type.includes(FileTypeEnum.AUDIO)) {
            setType(FileTypeEnum.AUDIO);
        } else if (file.type.includes(FileTypeEnum.VPN)) {
            setType(FileTypeEnum.VPN);
        }

        return () => URL.revokeObjectURL(url);
    }, [file]);

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
                {type === FileTypeEnum.IMAGE && <img src={url} className={styles.file_preview_image} />}
                {type === FileTypeEnum.VIDEO && <video src={url} className={styles.file_preview_image} />}
                {type === FileTypeEnum.AUDIO && (
                    <div className={styles.file_logo_background}>
                        <IoMusicalNotesSharp className={styles.file_logo} />
                    </div>
                )}
                {type === FileTypeEnum.VPN && (
                    <div className={styles.file_logo_background}>
                        <TbBrandOpenvpn className={styles.file_logo} strokeWidth={1} />
                    </div>
                )}
                {type === undefined && (
                    <div className={styles.file_logo_background}>
                        <CiFileOn className={styles.file_logo} />
                    </div>
                )}
            </div>
            <div className={`${styles.file_inf} text_translate`}>
                <div className={styles.file_name}>{file.name}</div>
                <div className={styles.file_size}>{size}</div>
            </div>
            <div className={styles.styles_background} onClick={deleteFile}>
                <MdDeleteOutline className={styles.logo_delete} />
            </div>
        </div>
    );
};
