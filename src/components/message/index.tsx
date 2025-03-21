import { FC, memo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { useVisibility } from './hooks/use-visibility.hook.ts';

// const domainRegex: RegExp = /(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi;
// const hashtagRegex: RegExp = /#[\p{L}\p{N}_-]+/gu;
//
// enum partTypeEnum {
//     TEXT = 'text',
//     LINK = 'link',
//     TAG = 'tag',
// }

// type partType = {
//     type: partTypeEnum;
//     content: string;
//     url?: string;
// };

// type IT = {};
// type LT = {
//     url: string;
//     image?: string;
//     title?: string;
//     description?: string;
// };
// type ST = {};

// type MT = {
//     message?: partType[];
//     images?: IT[];
//     link?: LT;
//     stickers?: ST;
// };

// const parseMessage = (text: string) => {
//     const parts: partType[] = [];
//     let lastIndex = 0;
//
//     text.replace(new RegExp(`${domainRegex.source}|${hashtagRegex.source}`, 'gu'), (match, offset) => {
//         if (offset > lastIndex) {
//             parts.push({ type: partTypeEnum.TEXT, content: text.slice(lastIndex, offset) });
//         }
//
//         if (match.startsWith('#')) {
//             parts.push({ type: partTypeEnum.TAG, content: match }); // Добавляем теги
//         } else {
//             const url = match.startsWith('http') ? match : `https://${match}`;
//             parts.push({ type: partTypeEnum.LINK, content: match, url });
//         }
//
//         lastIndex = offset + match.length;
//         return '';
//     });
//
//     if (lastIndex < text.length) {
//         parts.push({ type: partTypeEnum.TEXT, content: text.slice(lastIndex) });
//     }
//
//     return parts;
// };

// const RenderMessage: FC<{ parts: partType[] }> = ({ parts }) => {
//     return (
//         <pre className={styles.text}>
//             {parts.map((part, index) => {
//                 if (part.type === partTypeEnum.LINK) {
//                     return (
//                         <a key={index} href={part.url} target="_blank" rel="noopener noreferrer">
//                             {part.content}
//                         </a>
//                     );
//                 } else if (part.type === partTypeEnum.TAG) {
//                     return (
//                         <span key={index} className={styles.tags}>
//                             {part.content}
//                         </span>
//                     );
//                 }
//                 return part.content;
//             })}
//         </pre>
//     );
// };

const Message: FC<PropsType> = memo((props) => {
    const { number, type } = props;
    const [observerTarget, visibleMessage, time] = useVisibility(props);

    // const parts = parseMessage(visibleMessage);

    if (type == MessageTypeEnum.IS_CREATED_CHAT)
        return (
            <div ref={observerTarget} id={`message${number}`} className={styles.system_background}>
                <div className={`${styles.background} ${styles.system_message}`}>{visibleMessage}</div>
            </div>
        );

    return (
        <>
            <div ref={observerTarget} id={`message${number}`} className={`${styles.background}`}>
                <div>
                    {/*<RenderMessage parts={parts} />*/}
                    <pre className={styles.text}>{visibleMessage}</pre>
                </div>
                <div className={styles.left_div2}>{time}</div>
            </div>
        </>
    );
});

export default Message;
