import { FC, memo, useMemo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { RenderMessage } from '../render-message';
import { ParentMessage } from '../parent-message';
import { useAppSelector } from '../../root/store';
import { MessageFile } from '../message-file';
import { AudioFile } from '../message-audio';
import { FileExtensionEnum, FileTypeEnum } from '../../root/types/files/types.ts';
import { MessageImage } from '../message-image';
import { MessageMp3 } from '../message-mp3';
import { CanPlayAudio } from '../../common/hooks/can-play-audio.hook.ts';
import { useMessageMenu } from './hooks/use-message-menu.hook.ts';
import { MessageVideo } from '../message-video';
import { useReadMessage } from '../../common/hooks/use-read-message.hook.ts';
import { BsPinAngleFill } from 'react-icons/bs';
import { usePinned } from '../../common/hooks/use-pinned.hook.ts';
import { AiFillSound, AiFillStop } from 'react-icons/ai';
import { useSpeak } from './hooks/use-speak.hook.ts';
import { useText } from './hooks/use-text.hook.ts';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';

/** Message component */
const Message: FC<PropsType> = memo((props) => {
    const { type, number } = props;
    const [ref] = useReadMessage(number);
    const [messageID] = useMessageMenu(props);
    const [visibleMessage, time] = useText(props);
    const { handleSpeaking, isSpeaking } = useSpeak(visibleMessage, type);
    const navigate = useCustomNavigate();
    const ownUserName = useAppSelector((state) => state.user.userName);
    const pinnedMessages = useAppSelector((state) => state.chats.chatOnPage?.pinnedMessages);
    const isPinned = usePinned(props.id, pinnedMessages);

    const username = useMemo(() => {
        const maxLength = 20;
        if (!props.user.name) return;
        if (props.user.name.length > maxLength) return props.user.name.slice(0, maxLength);

        return props.user.name;
    }, [props?.user?.name]);

    if (type == MessageTypeEnum.IS_CREATED_CHAT)
        return (
            <div id={messageID} ref={ref} className={styles.system_background}>
                <div className={`${styles.background} ${styles.system_message} text_translate`}>{visibleMessage}</div>
            </div>
        );

    return (
        <>
            <div
                ref={ref}
                id={messageID}
                className={`${props?.user?.id === ownUserName ? styles.background_own : styles.background}`}
            >
                <div className={styles.name} onClick={() => navigate(`/${props.user.userName}`)}>
                    {username}
                </div>
                {!!props.parentMessage && <ParentMessage {...{ ...props.parentMessage }} />}
                <div className={styles.file_list}>
                    {props?.files?.map((file, index) => {
                        if (file.fileType === FileExtensionEnum.IS_VOICE) return <AudioFile key={index} file={file} />;
                        if (file.mimeType.includes(FileTypeEnum.IMAGE)) return <MessageImage key={index} file={file} />;
                        if (file.mimeType.includes(FileTypeEnum.VIDEO)) return <MessageVideo key={index} file={file} />;
                        if (CanPlayAudio(file)) return <MessageMp3 key={index} file={file} />;
                        return <MessageFile key={index} file={file} />;
                    })}
                </div>
                <RenderMessage message={visibleMessage} type={type} />
                <div className={`${styles.left_div2} text_translate`}>
                    {props.message?.length && (
                        <div className={styles.listen_button_background}>
                            <div className={styles.listen_button} onClick={handleSpeaking}>
                                {isSpeaking ? <AiFillStop /> : <AiFillSound />}
                            </div>
                        </div>
                    )}
                    {isPinned && <BsPinAngleFill className={styles.pin} />}
                    <div className={styles.time}>{time}</div>
                </div>
            </div>
        </>
    );
});

export default Message;
