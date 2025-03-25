import { FC, useMemo } from 'react';
import { PartTypeEnum } from '../../root/types/messages/part-type.enum.ts';
import { PropsType } from './types/props.type.ts';
import styles from '../message/index.module.css';
import { parseMessage } from '../input-message/common/parse-message.ts';
import { useTranslation } from 'react-i18next';

export const RenderMessage: FC<PropsType> = ({ message }) => {
    const { t } = useTranslation();
    const parts = useMemo(() => parseMessage(message), [t, message]);

    return (
        <pre className={styles.text}>
            {parts.map((part, index) => {
                if (part.type === PartTypeEnum.LINK) {
                    return (
                        <a key={index} href={part.url} target="_blank" rel="noopener noreferrer">
                            {part.content}
                        </a>
                    );
                } else if (part.type === PartTypeEnum.TAG) {
                    return (
                        <span key={index} className={styles.tags}>
                            {part.content}
                        </span>
                    );
                }
                return part.content;
            })}
        </pre>
    );
};
