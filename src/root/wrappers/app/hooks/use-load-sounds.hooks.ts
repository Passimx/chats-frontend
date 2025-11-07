import { useCallback, useEffect, useMemo } from 'react';
import { rawApp } from '../../../store/app/app.raw.ts';

let cachedAudioBuffer: AudioBuffer | null = null; // Кешируем звук

export const useLoadSoundsHooks = (): [() => Promise<void>] => {
    const audioContext = useMemo(() => new window.AudioContext(), []);

    const loadNotificationSound = useCallback(async () => {
        if (cachedAudioBuffer) return;

        try {
            const response = await fetch('/assets/sounds/message.mp3');
            const arrayBuffer = await response.arrayBuffer();
            cachedAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Ошибка загрузки звука:', error);
        }
    }, []);

    const playNotificationSound = useCallback(async () => {
        if (!rawApp.isMainTab) return;
        try {
            if (!cachedAudioBuffer) await loadNotificationSound();

            const source = audioContext.createBufferSource();
            source.buffer = cachedAudioBuffer;
            source.connect(audioContext.destination);
            source.start(0);
        } catch (error) {
            console.error('Ошибка воспроизведения звука:', error);
        }
    }, []);

    useEffect(() => {
        loadNotificationSound();
    }, []);

    return [playNotificationSound];
};
