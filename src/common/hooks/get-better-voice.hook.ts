export const getBetterVoice = async (blob: Blob): Promise<Blob> => {
    const arrayBuffer = await blob.arrayBuffer();

    // Загружаем звук в AudioContext
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Создаем оффлайн контекст для обработки (рендерим новый аудиофайл)
    const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate,
    );

    // Источник
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    // --- Фильтр: убираем гул ниже 100 Гц ---
    const highPass = offlineContext.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.value = 100;

    // --- Эквалайзер ---
    // Немного усилим "речь" (1 кГц – 3 кГц)
    const eq = offlineContext.createBiquadFilter();
    eq.type = 'peaking';
    eq.frequency.value = 1500;
    eq.Q.value = 1;
    eq.gain.value = 3; // +3 dB

    // --- Компрессор ---
    const compressor = offlineContext.createDynamicsCompressor();
    compressor.threshold.value = -30; // порог срабатывания
    compressor.knee.value = 40;
    compressor.ratio.value = 4; // насколько сжимает
    compressor.attack.value = 0.01;
    compressor.release.value = 0.25;

    // --- Нормализация (через Gain) ---
    const gainNode = offlineContext.createGain();
    gainNode.gain.value = 1.2; // чуть громче

    // Цепочка: source -> highPass -> eq -> compressor -> gain -> destination
    source.connect(highPass);
    highPass.connect(eq);
    eq.connect(compressor);
    compressor.connect(gainNode);
    gainNode.connect(offlineContext.destination);

    // Старт
    source.start(0);

    // Рендерим результат
    const renderedBuffer = await offlineContext.startRendering();

    // Переводим в WAV Blob
    const wavBlob = await audioBufferToWavBlob(renderedBuffer);
    return wavBlob;
};

// Вспомогательная функция: AudioBuffer -> WAV Blob
async function audioBufferToWavBlob(audioBuffer: AudioBuffer): Promise<Blob> {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const result: Float32Array[] = [];
    for (let channel = 0; channel < numberOfChannels; channel++) {
        result.push(audioBuffer.getChannelData(channel));
    }

    const interleaved = interleave(result);
    const buffer = encodeWAV(interleaved, sampleRate, bitDepth, numberOfChannels, format);
    return new Blob([buffer], { type: 'audio/wav' });
}

function encodeWAV(
    samples: Float32Array,
    sampleRate: number,
    bitDepth: number,
    numChannels: number,
    format: number,
): ArrayBuffer {
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * blockAlign, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * bytesPerSample, true);
    floatTo16BitPCM(view, 44, samples);

    return buffer;
}

function interleave(channels: Float32Array[]): Float32Array {
    const length = channels[0].length * channels.length;
    const result = new Float32Array(length);

    let index = 0;
    for (let i = 0; i < channels[0].length; i++) {
        for (let j = 0; j < channels.length; j++) {
            result[index++] = channels[j][i];
        }
    }
    return result;
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
