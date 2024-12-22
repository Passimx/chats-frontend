import { useRef } from 'react';

export const useDebouncedFunction = (delay: number = 2000) => {
    const ref = useRef<any>(null);

    return (func: (...args: unknown[]) => unknown) => {
        clearTimeout(ref.current);
        ref.current = setTimeout(() => func(), delay);
    };
};
