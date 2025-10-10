import { useEffect, useState } from 'react';

export interface MemoryPoint {
    time: number; // timestamp
    usedMB: number;
}

export const useMemoryGraph = (interval = 2000, maxPoints = 50) => {
    const [history, setHistory] = useState<MemoryPoint[]>([]);

    useEffect(() => {
        if (!('memory' in performance)) {
            console.warn('performance.memory не поддерживается в этом браузере');
            return;
        }

        const updateMemory = () => {
            const { usedJSHeapSize } = (performance as any).memory;
            const usedMB = usedJSHeapSize / 1024 / 1024;

            setHistory((prev) => {
                const next = [...prev, { time: Date.now(), usedMB }];
                // if (next.length > maxPoints) next.shift(); // ограничиваем историю
                return next;
            });
        };

        updateMemory();
        const id = setInterval(updateMemory, interval);
        return () => clearInterval(id);
    }, [interval, maxPoints]);

    return history;
};
