export function getAudioDurationFromBlob(blob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            audio.addEventListener('loadedmetadata', () => {
                resolve(Math.trunc(audio.duration));
                URL.revokeObjectURL(url);
            });

            audio.addEventListener('error', (e) => {
                reject(e);
                URL.revokeObjectURL(url);
            });
        } catch (e) {
            reject(e);
        }
    });
}
