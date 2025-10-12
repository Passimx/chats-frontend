import { FC, memo, useContext, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { ContextMedia } from '../preview-media-context';
import { MdOutlineCancel } from 'react-icons/md';
import { useAppSelector } from '../../root/store';
import { PreviewFile } from '../preview-file';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { useSendMessage } from './hooks/use-send-message.hook.ts';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { useTranslation } from 'react-i18next';
import { FileTypeEnum } from '../../root/types/files/types.ts';
import { PreviewMusic } from '../preview-music';

function setThemeColor(color: string) {
    let metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', color);
}

export const PreviewMedia: FC = memo(() => {
    const visibility = useVisibility;
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

        setThemeColor('black');
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setFiles(undefined);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [files]);

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
                        <div></div>
                        <MdOutlineCancel className={styles.cancel_logo} onClick={() => setFiles(undefined)} />
                    </div>
                    <div className={styles.files}>
                        {filesArray.map(
                            (file, key) =>
                                (file.type.includes(FileTypeEnum.AUDIO) && (
                                    <PreviewMusic key={key} file={file} number={key} />
                                )) || <PreviewFile key={key} file={file} number={key} />,
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
                                className={`${styles.placeholder_text} ${visibility(styles.show_slowly, styles.hide_slowly, isShowPlaceholder)} text_translate`}
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
