import { FC } from 'react';
import { PartTypeEnum } from '../../root/types/messages/part-type.enum.ts';
import { PropsType } from './types/props.type.ts';
import styles from '../message/index.module.css';
import { parseMessage } from '../input-message/common/parse-message.ts';
import { Link } from '../link';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { AudioView } from '../audio-view';
import { MimetypeEnum } from '../../root/types/files/file.type.ts';

export const RenderMessage: FC<PropsType> = ({ message, type, files }) => {
    const parts = parseMessage(message);
    const filesAudio = files?.filter((file) => file.mimeType === MimetypeEnum.AUDIO_WAV);

    return (
        <pre className={`${styles.text} ${type === MessageTypeEnum.IS_SYSTEM && 'text_translate'}`}>
            {filesAudio?.map((filesAudio) => <AudioView key={filesAudio.id} fileAudio={filesAudio} />)}
            {parts.map((part, index) => {
                if (part.type === PartTypeEnum.LINK)
                    return (
                        <Link key={index} href={part.url}>
                            {part.content}
                        </Link>
                    );
                else if (part.type === PartTypeEnum.TAG)
                    return (
                        <span key={index} className={styles.tags}>
                            {part.content}
                        </span>
                    );
                return part.content;
            })}
        </pre>
    );
};
