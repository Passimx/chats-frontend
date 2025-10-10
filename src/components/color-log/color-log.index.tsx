import { FC, memo } from 'react';

export const ColorLog: FC<{ text: string }> = memo(({ text }) => {
    const patterns = [
        { regex: /\b(error|failed|exception)\b/gi, color: '#ff4d4f' },
        { regex: /\b(warn|warning)\b/gi, color: '#ffb700' },
        { regex: /\b(success|ok|done|ready)\b/gi, color: '#4caf50' },
        { regex: /https?:\/\/[^\s]+/gi, color: '#4da3ff' },
        { regex: /{[^{}]*}/g, color: '#8bc34a' },
        { regex: /[a-zA-Z]+/g, color: '#bbb' },
        { regex: /\b\d+(\.\d+)?\b/g, color: '#b366ff' },
    ];

    function colorizeRecursively(str: string, keyStart = 0): React.ReactNode {
        if (!str) return null;
        for (const { regex, color } of patterns) {
            const match = regex.exec(str);
            if (match && match.index !== undefined) {
                const before = str.slice(0, match.index);
                const matched = match[0];
                const after = str.slice(match.index + matched.length);

                return (
                    <>
                        {before && colorizeRecursively(before, keyStart)}
                        <span key={keyStart} style={{ color }}>
                            {matched}
                        </span>
                        {after && colorizeRecursively(after, keyStart + 1)}
                    </>
                );
            }
        }

        // Если ни одно правило не подошло — вернуть как есть
        return str;
    }

    return <span>{colorizeRecursively(text)}</span>;
});
