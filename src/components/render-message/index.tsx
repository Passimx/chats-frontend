import { FC, memo } from 'react';
import { PartTypeEnum } from '../../root/types/messages/part-type.enum.ts';
import { PropsType } from './types/props.type.ts';
import styles from '../message/index.module.css';

export const RenderMessage: FC<PropsType> = memo(({ message }) => {
    return (
        <pre className={styles.text}>
            {message.map((part, index) => {
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
});
