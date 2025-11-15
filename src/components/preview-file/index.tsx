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
    const previewId = file.metaData?.previewId;
    const [type, setType] = useState<FileTypeEnum>();
    const { deleteFile } = useContext(ContextMedia)!;

    useEffect(() => {
        if (file.type.includes(FileTypeEnum.IMAGE)) setType(FileTypeEnum.IMAGE);
        else if (file.type.includes(FileTypeEnum.VIDEO)) setType(FileTypeEnum.VIDEO);
        else if (file.type.includes(FileTypeEnum.VPN)) setType(FileTypeEnum.VPN);
    }, [file]);

    return (
        <div className={styles.background}>
            <div>
                {type && [FileTypeEnum.IMAGE, FileTypeEnum.VIDEO].includes(type) && (
                    <img src={previewId} className={styles.file_preview_image} alt={'image'} />
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
            <EditFileName {...{ file, number }} />
            <div className={styles.styles_background} onClick={() => deleteFile(number)}>
                <MdDeleteOutline className={styles.logo_delete} />
            </div>
        </div>
    );
});
