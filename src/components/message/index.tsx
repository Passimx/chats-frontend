import { FC, memo } from 'react';
import styles from './index.module.css';
import { PropsType } from './types/props.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { useVisibility } from './hooks/use-visibility.hook.ts';

const Message: FC<PropsType> = memo((props) => {
    const { number, type } = props;
    const [observerTarget, visibleMessage, time] = useVisibility(props);

    if (type == MessageTypeEnum.IS_SYSTEM)
        return (
            <div ref={observerTarget} id={`message${number}`} className={styles.system_background}>
                <div className={`${styles.background} ${styles.system_message}`}>{visibleMessage}</div>
            </div>
        );

    // const makeLinksClickable = (text: string) => {
    //     // Регулярное выражение для поиска ссылок
    //     const urlRegex = /(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi;
    //
    //     return text.split(/(\s+)/).map((part, index) => {
    //         const match = part.match(urlRegex);
    //
    //         if (match) {
    //             let url = match[0].replace(/[.,!?]+$/, ''); // Убираем знаки препинания в конце ссылки
    //             if (!url.startsWith('http')) {
    //                 url = `https://${url}`; // Добавляем `https://`, если отсутствует
    //             }
    //             return (
    //                 <a key={index} href={url} target="_blank" rel="noopener noreferrer">
    //                     {match[0]}
    //                 </a>
    //             );
    //         }
    //
    //         return part;
    //     });
    // };

    const makeLinksClickable = (text: string) => {
        const parts = [];
        let lastIndex = 0;
        const domainRegex = /(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi;
        text.replace(domainRegex, (match, offset) => {
            // Добавляем текст ДО ссылки
            if (offset > lastIndex) {
                parts.push(text.slice(lastIndex, offset));
            }

            // Определяем финальный URL (добавляем HTTPS, если нужно)
            const url = match.startsWith('http') ? match : `https://${match}`;

            // Добавляем JSX-ссылку
            parts.push(
                <a key={offset} href={url} target="_blank" rel="noopener noreferrer">
                    {match}
                </a>,
            );

            lastIndex = offset + match.length;
            return '';
        });

        // Добавляем оставшийся текст (после последней ссылки)
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts;
    };

    return (
        <>
            <div ref={observerTarget} id={`message${number}`} className={`${styles.background}`}>
                <div>
                    <pre className={styles.text}>{makeLinksClickable(visibleMessage)}</pre>
                </div>
                <div className={styles.left_div2}>{time}</div>
            </div>
        </>
    );
});

export default Message;
