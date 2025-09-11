import { FC, memo, useCallback } from 'react';
import { PropsType } from './props.type.ts';
import { useFileSize } from '../../common/hooks/use-file-size.ts';
import styles from './index.module.css';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { FileMap, MimetypeEnum } from '../../root/types/files/types.ts';
import { CiFileOn } from 'react-icons/ci';
import { DownloadFile } from '../../root/api/files/file.ts';
import { TbBrandOpenvpn } from 'react-icons/tb';
import {
    BsCode,
    BsDownload,
    BsFiletypeCss,
    BsFiletypeCsv,
    BsFiletypeDoc,
    BsFiletypeDocx,
    BsFiletypeHtml,
    BsFiletypeJs,
    BsFiletypeJsx,
    BsFiletypePdf,
    BsFiletypePpt,
    BsFiletypeTsx,
    BsFiletypeTxt,
    BsFiletypeXls,
    BsFiletypeXlsx,
    BsFiletypeYml,
    BsFileZip,
} from 'react-icons/bs';

export const MessageFile: FC<PropsType> = memo(({ file }) => {
    const size = useFileSize(file.size);

    const download = useCallback(() => {
        DownloadFile(file);
    }, [file]);

    console.log([file.originalName, file.mimeType]);

    return (
        <div className={styles.background} onClick={download}>
            <div className={styles.file_background}>
                {FileMap.get('MP3')?.includes(file.mimeType) && <IoMusicalNotesSharp className={styles.file_logo} />}
                {FileMap.get('ZIP')?.includes(file.mimeType) && <BsFileZip className={styles.file_logo} />}
                {FileMap.get('SH')?.includes(file.mimeType) && <BsCode className={styles.file_logo} />}
                {FileMap.get('PPT')?.includes(file.mimeType) && <BsFiletypePpt className={styles.file_logo} />}
                {!Object.values(MimetypeEnum).includes(file.mimeType) && <CiFileOn className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.HTML && <BsFiletypeHtml className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.DOCX && <BsFiletypeDocx className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.OVPN && <TbBrandOpenvpn className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.PDF && <BsFiletypePdf className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.CSS && <BsFiletypeCss className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.JS && <BsFiletypeJs className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.TS && <BsFiletypeJs className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.TSX && <BsFiletypeTsx className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.JSX && <BsFiletypeJsx className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.TXT && <BsFiletypeTxt className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.CSV && <BsFiletypeCsv className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.YML && <BsFiletypeYml className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.PPT && <BsFiletypePpt className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.XLSX && <BsFiletypeXlsx className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.XLS && <BsFiletypeXls className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.DOC && <BsFiletypeDoc className={styles.file_logo} />}
                {file.mimeType === MimetypeEnum.BINARY && file.originalName.includes('.ovpn') && (
                    <TbBrandOpenvpn className={styles.file_logo} />
                )}
                <BsDownload className={styles.download_logo} />
            </div>
            <div className={styles.file_inf}>
                <div className={styles.name}>{file.originalName}</div>
                <div className={styles.size}>{size}</div>
            </div>
        </div>
    );
});
