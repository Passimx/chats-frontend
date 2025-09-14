export async function getAudioWaveform(blob: Blob, barsCount = 60): Promise<number[]> {
    // создаём AudioContext
    const audioCtx = new AudioContext();

    // читаем blob → ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // декодируем в AudioBuffer
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const rawData = audioBuffer.getChannelData(0); // берём только 1 канал (моно)
    const samplesPerBar = Math.floor(rawData.length / barsCount);

    const waveform: number[] = [];

    for (let i = 0; i < barsCount; i++) {
        const start = i * samplesPerBar;
        const end = start + samplesPerBar;

        let sum = 0;
        for (let j = start; j < end; j++) {
            sum += Math.abs(rawData[j]); // берём амплитуду
        }

        // среднее значение амплитуды для этого бара
        waveform.push(sum / samplesPerBar);
    }

    // нормализуем (чтобы значения были от 0 до 1)
    const max = Math.max(...waveform);
    return waveform.map((v) => Number((v / max).toFixed(2)));
}
