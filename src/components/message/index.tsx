import { FC, memo, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { RenderMessage } from '../render-message';
import { ParentMessage } from '../parent-message';
import { useAppAction, useAppSelector } from '../../root/store';
import { MessageFile } from '../message-file';
import { AudioFile } from '../message-audio';
import { FileExtensionEnum, FileTypeEnum } from '../../root/types/files/types.ts';
import { MessageImage } from '../message-image';
import { MessageMp3 } from '../message-mp3';
import { CanPlayAudio } from '../../common/hooks/can-play-audio.hook.ts';
import moment from 'moment/min/moment-with-locales';
import { useTranslation } from 'react-i18next';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
import { useVisibility } from '../../common/hooks/use-visibility.hook.ts';
import { useMessageMenu } from './hooks/use-message-menu.hook.ts';

const Message: FC<PropsType> = memo((props) => {
    const { postMessageToBroadCastChannel } = useAppAction();
    const { t } = useTranslation();
    const { type } = props;
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [elementId] = useMessageMenu(props);
    const [observerTarget, visible] = useVisibility();

    useEffect(() => {
        if (visible && chatOnPage?.readMessage !== undefined && props.number > chatOnPage.readMessage)
            postMessageToBroadCastChannel({
                event: EventsEnum.READ_MESSAGE,
                data: { id: chatOnPage.id, readMessage: props.number },
            });
    }, [visible, chatOnPage?.readMessage]);

    const [visibleMessage, time] = useMemo(() => {
        const time = moment(props.createdAt).format('LT');
        let message;
        if (type === MessageTypeEnum.IS_CREATED_CHAT) message = `${t(props.message)} «${chatOnPage?.title}»`;
        else if (type === MessageTypeEnum.IS_SYSTEM) message = t(props.message);
        else message = props.message;

        return [message, time];
    }, [t]);

    if (type == MessageTypeEnum.IS_CREATED_CHAT)
        return (
            <div ref={observerTarget} id={elementId} className={styles.system_background}>
                <div className={`${styles.background} ${styles.system_message} text_translate`}>{visibleMessage}</div>
            </div>
        );

    return (
        <>
            <div ref={observerTarget} id={elementId} className={`${styles.background}`}>
                {!!props.parentMessage && <ParentMessage {...{ ...props.parentMessage }} />}
                <div className={styles.file_list}>
                    {props?.files?.map((file, index) => {
                        if (file.fileType === FileExtensionEnum.IS_VOICE) return <AudioFile key={index} file={file} />;
                        if (file.mimeType.includes(FileTypeEnum.IMAGE)) return <MessageImage key={index} file={file} />;
                        if (CanPlayAudio(file)) return <MessageMp3 key={index} file={file} />;
                        return <MessageFile key={index} file={file} />;
                    })}
                </div>
                <RenderMessage message={visibleMessage} type={type} />
                <div className={`${styles.left_div2} text_translate`}>{time}</div>
            </div>
        </>
    );
});

export default Message;
