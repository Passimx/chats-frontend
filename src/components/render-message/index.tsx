import { FC } from 'react';
import { PartTypeEnum } from '../../root/types/messages/part-type.enum.ts';
import { PropsType } from './types/props.type.ts';
import styles from '../message/index.module.css';
import { parseMessage } from '../input-message/common/parse-message.ts';
import { Link } from '../link';

export const RenderMessage: FC<PropsType> = ({ message }) => {
    const parts = parseMessage(message);

    return (
        <pre className={styles.text}>
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
