import { useMemo } from 'react';

export const useShortText = (text?: string) => {
    return useMemo(() => {
        if (!text) return '';
        if (text.length <= 20) return text;
        return text.slice(0, 10) + '...' + text.slice(-10);
    }, [text]);
};
