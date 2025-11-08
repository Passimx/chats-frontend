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
import moment from 'moment/min/moment-with-locales';
import { useTranslation } from 'react-i18next';
import { useMessageMenu } from './hooks/use-message-menu.hook.ts';
import { MessageVideo } from '../message-video';
import { useReadMessage } from '../../common/hooks/use-read-message.hook.ts';
import { BsPinAngleFill } from 'react-icons/bs';
import { usePinned } from '../../common/hooks/use-pinned.hook.ts';

const Message: FC<PropsType> = memo((props) => {
    const { type, number } = props;

    const [ref] = useReadMessage(number);
    const { t } = useTranslation();
    const [elementId] = useMessageMenu(props);
    const title = useAppSelector((state) => state.chats.chatOnPage?.title);
    const pinnedMessages = useAppSelector((state) => state.chats.chatOnPage?.pinnedMessages);
    const isPinned = usePinned(props.id, pinnedMessages);

    const [visibleMessage, time] = useMemo(() => {
        const time = moment(props.createdAt).format('LT');
        let message;
        if (type === MessageTypeEnum.IS_CREATED_CHAT) message = `${t(props.message)} «${title}»`;
        else if (type === MessageTypeEnum.IS_SYSTEM) message = t(props.message);
        else message = props.message;

        return [message, time];
    }, [t]);

    if (type == MessageTypeEnum.IS_CREATED_CHAT)
        return (
            <div id={elementId} ref={ref} className={styles.system_background}>
                <div className={`${styles.background} ${styles.system_message} text_translate`}>{visibleMessage}</div>
            </div>
        );

    return (
        <>
            <div ref={ref} id={elementId} className={`${styles.background}`}>
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
                    {isPinned && <BsPinAngleFill className={styles.pin} />}
                    <div className={styles.time}>{time}</div>
                </div>
            </div>
        </>
    );
});

export default Message;
