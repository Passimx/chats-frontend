import React, { useEffect, useRef, useState } from 'react';
import { PropsType } from './types/props.type.ts';

export const AudioPlayer: React.FC<PropsType> = ({
    audioSrc,
    barColor = '#4A90E2',
    barWidth = 2,
    gap = 2,
    minBarHeight = 1,
}) => {
    const width = 250;
    const height = 20;

    const middleY = height / 2;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

    useEffect(() => {
        const audioContext = new AudioContext();

        async function load() {
            const response = await fetch(audioSrc);
            const arrayBuffer = await response.arrayBuffer();
            const decoded = await audioContext.decodeAudioData(arrayBuffer);
            setAudioBuffer(decoded);
        }

        load();
    }, [audioSrc]);

    useEffect(() => {
        if (!audioBuffer || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Чистим canvas
        ctx.clearRect(0, 0, width, height);

        // Получаем данные из первого канала
        const rawData = audioBuffer.getChannelData(0); // float32 array [-1..1]

        const samplesPerBar = Math.floor(rawData.length / (width / (barWidth + gap))); // сколько сэмплов на один столбец
        const barCount = Math.floor(rawData.length / samplesPerBar);

        const normalizedData: number[] = [];

        // Вычисляем амплитуду (абсолютное значение среднего сэмпла) или RMS для каждого блока
        for (let i = 0; i < barCount; i++) {
            let sum = 0;
            const start = i * samplesPerBar;
            for (let j = 0; j < samplesPerBar; j++) {
                const sample = rawData[start + j];
                sum += Math.abs(sample); // амплитуда
            }
            const avg = sum / samplesPerBar;
            normalizedData.push(avg);
        }

        // Нормализуем данные для отображения относительно canvas высоты
        const max = Math.max(...normalizedData);
        const scale = max > 0 ? height / max : 1;

        ctx.fillStyle = barColor;

        normalizedData.forEach((val, i) => {
            let barHeight = val * scale;
            if (barHeight > 0 && barHeight < minBarHeight) barHeight = minBarHeight;

            const x = i * (barWidth + gap);

            ctx.fillRect(x, middleY, barWidth, barHeight);

            ctx.fillRect(x, middleY, barWidth, -barHeight);
        });
    }, [audioBuffer, width, height, barColor, barWidth, gap]);

    return (
        <div>
            <button type={'submit'}>play</button>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ backgroundColor: 'white', cursor: 'pointer' }}
            />
        </div>
    );
};
