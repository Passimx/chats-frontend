import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { getCacheMemory, getIndexedDBMemory } from '../../../../common/cache/get-cache-memory.ts';
import { getTotalMemory } from '../../../../common/cache/get-total-memory.ts';
import { StateType } from '../../../store/app/types/state.type.ts';

export const useMemory = () => {
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { setStateApp } = useAppAction();

    const getMemory = async () => {
        const tasks: Partial<StateType>[] = await Promise.all([
            getCacheMemory(),
            getTotalMemory(),
            getIndexedDBMemory(),
        ]);

        tasks.forEach((data) => setStateApp(data));
    };

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;
        getMemory();
    }, [isLoadedChatsFromIndexDb]);
};
