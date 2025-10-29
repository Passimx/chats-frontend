import { FC, memo, useContext, useEffect, useState } from 'react';
import { PropsType } from './props.type.ts';
import styles from './index.module.css';
import { CiFileOn } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { ContextMedia } from '../preview-media-context';
import { TbBrandOpenvpn } from 'react-icons/tb';
import { FileTypeEnum } from '../../root/types/files/types.ts';
import { EditFileName } from '../edit-file-name';

export const PreviewFile: FC<PropsType> = memo(({ file, number }) => {
    const [url, setUrl] = useState<string>('');
    const [type, setType] = useState<FileTypeEnum>();
    const { deleteFile } = useContext(ContextMedia)!;

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
        } else if (file.type.includes(FileTypeEnum.VPN)) {
            setType(FileTypeEnum.VPN);
        }

        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <div className={styles.background}>
            <div>
                {type === FileTypeEnum.IMAGE && <img src={url} className={styles.file_preview_image} />}
                {type === FileTypeEnum.VIDEO && <video src={url} className={styles.file_preview_image} />}
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
            <EditFileName {...{ file, number }} />
            <div className={styles.styles_background} onClick={() => deleteFile(number)}>
                <MdDeleteOutline className={styles.logo_delete} />
            </div>
        </div>
    );
});
