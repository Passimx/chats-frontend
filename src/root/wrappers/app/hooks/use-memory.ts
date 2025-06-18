import { useAppAction } from '../../../store';
import { useCallback, useEffect } from 'react';
import { getTotalMemory } from '../../../../common/cache/get-total-memory.ts';
import { getCacheMemory } from '../../../../common/cache/get-cache-memory.ts';

export const useMemory = () => {
    const { setStateApp } = useAppAction();

    const getMemoryStr = useCallback((value: number) => {
        return `${value / 1024 / 1024} Mb`;
    }, []);

    useEffect(() => {
        getCacheMemory().then((cacheMemory) => setStateApp({ cacheMemory: getMemoryStr(cacheMemory) }));
        getTotalMemory().then((totalMemory) => setStateApp({ totalMemory: getMemoryStr(totalMemory) }));
    }, []);
};
