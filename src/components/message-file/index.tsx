import { FC, memo, MouseEvent, useCallback, useContext, useMemo } from 'react';
import { PropsType } from './props.type.ts';
import { useFileSize } from '../../common/hooks/use-file-size.ts';
import styles from './index.module.css';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { FileMap, MimetypeEnum } from '../../root/types/files/types.ts';
import { CiFileOn } from 'react-icons/ci';
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
import { useDownloadFile } from '../audio-file/hooks/use-download-file.hook.ts';
import { CanPlayAudio } from '../../common/hooks/can-play-audio.hook.ts';
import { LoadRadius } from '../load-radius';
import { AudioPlayerContext } from '../../root/contexts/audio-player';
import { FaPause } from 'react-icons/fa';
import { MdDownloadForOffline } from 'react-icons/md';
import { Envs } from '../../common/config/envs/envs.ts';

export const MessageFile: FC<PropsType> = memo(({ file }) => {
    const r = 17;
    const strokeWidth = 3;
    const size = useFileSize(file.size);
    const { downloadPercent, blob, clickFile, downloadOnDevice } = useDownloadFile(file);
    const { isPlaying, audio } = useContext(AudioPlayerContext)!;

    const backgroundImage = useMemo(() => {
        if (file.metadata.previewId) return `url(${Envs.filesServiceUrl}/${file.chatId}/${file.metadata.previewId})`;
        return undefined;
    }, [file.metadata.previewId]);

    const download = useCallback(
        (e: MouseEvent<unknown>) => {
            e.stopPropagation();
            downloadOnDevice();
        },
        [file, downloadOnDevice],
    );

    return (
        <div className={`${styles.background} ${!blob && styles.background_animation}`} onClick={clickFile}>
            <div className={styles.file_background} style={{ backgroundImage }}>
                {downloadPercent === undefined && (!isPlaying || audio?.file.id !== file.id) && (
                    <div className={styles.file_icon}>
                        {CanPlayAudio(file) && <IoMusicalNotesSharp className={styles.file_logo} />}
                        {FileMap.get('ZIP')?.includes(file.mimeType) && <BsFileZip className={styles.file_logo} />}
                        {FileMap.get('SH')?.includes(file.mimeType) && <BsCode className={styles.file_logo} />}
                        {FileMap.get('PPT')?.includes(file.mimeType) && <BsFiletypePpt className={styles.file_logo} />}
                        {!Object.values(MimetypeEnum).includes(file.mimeType) && !CanPlayAudio(file) && (
                            <CiFileOn className={styles.file_logo} />
                        )}
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
                )}
                {isPlaying && audio?.file.id === file.id && <FaPause className={styles.play_button} />}
                {downloadPercent !== undefined && <div className={styles.stop_button}>X</div>}
                {downloadPercent !== undefined && (
                    <div className={styles.background_stop}>
                        <LoadRadius radius={r} strokeWidth={strokeWidth} percent={downloadPercent} />
                    </div>
                )}
            </div>
            <div className={styles.file_inf}>
                <div className={styles.name_background}>
                    <MdDownloadForOffline className={styles.name_background_logo} onClick={download} />
                    <div className={styles.name}>{file.originalName}</div>
                </div>
                <div className={styles.size}>
                    <div>{size}</div>
                    <div>{downloadPercent !== undefined ? `(${downloadPercent?.toFixed(0)}%)` : ''}</div>
                </div>
            </div>
        </div>
    );
});
