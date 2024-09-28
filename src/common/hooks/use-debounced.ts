import { useEffect, useState } from 'react';

function useDebounced<T>(value: T, delay: number = 1000): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}
export default useDebounced;
