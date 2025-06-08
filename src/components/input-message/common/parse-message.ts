import { ParseMessagePartType } from '../../../root/types/messages/parse-message-part.type.ts';
import { PartTypeEnum } from '../../../root/types/messages/part-type.enum.ts';

export const parseMessage = (text: string): ParseMessagePartType[] => {
    const domainRegex: RegExp = /(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi;
    const hashtagRegex: RegExp = /#[\p{L}\p{N}_-]+/gu;

    const parts: ParseMessagePartType[] = [];
    let lastIndex = 0;

    text?.replace(new RegExp(`${domainRegex.source}|${hashtagRegex.source}`, 'gu'), (match, offset) => {
        if (offset > lastIndex) {
            parts.push({ type: PartTypeEnum.TEXT, content: text.slice(lastIndex, offset) });
        }

        if (match.startsWith('#')) {
            parts.push({ type: PartTypeEnum.TAG, content: match }); // Добавляем теги
        } else {
            const url = match.startsWith('http') ? match : `https://${match}`;
            parts.push({ type: PartTypeEnum.LINK, content: match, url });
        }

        lastIndex = offset + match.length;
        return '';
    });

    if (lastIndex < text?.length) {
        parts.push({ type: PartTypeEnum.TEXT, content: text.slice(lastIndex) });
    }

    return parts;
};
