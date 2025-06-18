export const getTotalMemory = async (): Promise<number> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const { quota } = await navigator.storage.estimate();
        return quota ?? 0;
    } else {
        console.log('StorageManager API не поддерживается');
        return 0;
    }
};
