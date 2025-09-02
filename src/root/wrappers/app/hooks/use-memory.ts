import { useAppAction } from '../../../store';
import { useEffect } from 'react';
import { getCacheMemory, getUseMemory } from '../../../../common/cache/get-cache-memory.ts';
import { getTotalMemory } from '../../../../common/cache/get-total-memory.ts';

export const useMemory = () => {
    const { setStateApp } = useAppAction();

    useEffect(() => {
        getUseMemory().then((useMemory) => setStateApp({ useMemory }));
        getCacheMemory().then((cacheMemory) => setStateApp({ cacheMemory }));
        getTotalMemory().then((totalMemory) => setStateApp({ totalMemory }));
    }, []);
};
