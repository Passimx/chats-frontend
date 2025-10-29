import { FC, memo, useContext, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { ContextMedia } from '../preview-media-context';
import { MdOutlineCancel } from 'react-icons/md';
import { useAppSelector } from '../../root/store';
import { PreviewFile } from '../preview-file';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { useSendMessage } from './hooks/use-send-message.hook.ts';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import { useTranslation } from 'react-i18next';
import { FileTypeEnum } from '../../root/types/files/types.ts';
import { PreviewMusic } from '../preview-music';
import { setThemeColor } from '../../common/hooks/set-theme-color.ts';
import { getFileSize } from '../../common/hooks/get-file-size.ts';

export const PreviewMedia: FC = memo(() => {
    const [isShowPlaceholder] = useSendMessage();
    const { t } = useTranslation();
    const { files, setFiles } = useContext(ContextMedia)!;
    const filesArray = useMemo(() => (files ? Array.from(files) : []), [files]);
    const { chatOnPage } = useAppSelector((state) => state.chats);

    useEffect(() => {
        if (!files?.length) {
            setThemeColor('#062846');
            return;
        }

        setThemeColor('#02101C');
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setFiles(undefined);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [files]);

    const size = useMemo(() => {
        return files?.reduce((prevSum, file) => prevSum + file.size, 0);
    }, [files?.length]);

    const sizeName = useMemo(() => {
        const [memory, unit] = getFileSize(size);
        return `${memory} ${t(unit)}`;
    }, [size]);

    if (files?.length)
        return (
            <div
                className={styles.background}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setFiles(undefined);
                }}
            >
                <div className={styles.main}>
                    <div className={styles.header}>
                        <div className={styles.files_inf}>{sizeName}</div>
                        <MdOutlineCancel className={styles.cancel_logo} onClick={() => setFiles(undefined)} />
                    </div>
                    <div className={styles.files}>
                        {filesArray.map(
                            (file, key) =>
                                (file.type.includes(FileTypeEnum.AUDIO) && (
                                    <PreviewMusic key={file.randomId} file={file} number={key} />
                                )) || <PreviewFile key={file.randomId} file={file} number={key} />,
                        )}
                    </div>
                    <div className={styles.message_input}>
                        <div className={styles.emoji_main}>
                            <div className={styles.emoji_background}>
                                {/*<BsEmojiSmile className={styles.button_emoji} />*/}
                            </div>
                        </div>
                        <div id={styles.new_message_block}>
                            <div
                                className={`${styles.placeholder_text} ${setVisibilityCss(styles.show_slowly, styles.hide_slowly, isShowPlaceholder)} text_translate`}
                                dir="auto"
                            >
                                {t('chats_enter_message')}
                            </div>
                            <div
                                id={styles.new_message}
                                contentEditable={chatOnPage?.type !== ChatEnum.IS_SYSTEM}
                                dir="auto"
                            ></div>
                        </div>
                        <div className={styles.button_background_main}>
                            <div id={styles.button_background}>
                                <BsFillArrowUpCircleFill id={styles.button} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
});
