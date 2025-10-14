import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { getCacheMemory } from '../../../../common/cache/get-cache-memory.ts';
import { getTotalMemory } from '../../../../common/cache/get-total-memory.ts';

export const useMemory = () => {
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { setStateApp } = useAppAction();

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;

        getCacheMemory().then((cacheMemory) => setStateApp({ cacheMemory }));
        getTotalMemory().then((totalMemory) => setStateApp({ totalMemory }));
    }, [isLoadedChatsFromIndexDb]);
};
