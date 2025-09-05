import { FC, memo, useContext, useEffect } from 'react';
import styles from './index.module.css';
import { ContextMedia } from '../preview-media-context';
import { MdOutlineCancel } from 'react-icons/md';
import { useAppSelector } from '../../root/store';
import { PreviewFile } from '../preview-file';

export const PreviewMedia: FC = memo(() => {
    const { files, setFiles } = useContext(ContextMedia)!;
    const { chatOnPage } = useAppSelector((state) => state.chats);

    useEffect(() => {
        if (!files?.length) return;

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
                        {Array.from(files).map((file, key) => (
                            <PreviewFile key={key} number={key} file={file} />
                        ))}
                    </div>
                    <div className={styles.message_input}>{chatOnPage?.inputMessage}</div>
                </div>
            </div>
        );
});
