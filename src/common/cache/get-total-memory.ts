import { StateType } from '../../root/store/app/types/state.type.ts';

export const getTotalMemory = async (): Promise<Partial<StateType>> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const { quota } = await navigator.storage.estimate();
        if (quota) return { totalMemory: quota };
    }

    console.log('StorageManager API не поддерживается');
    return { totalMemory: undefined };
};
