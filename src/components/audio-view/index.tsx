import React, { memo } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { useLoad } from './hooks/use-load.hook.ts';
import { MdCancel } from 'react-icons/md';
import { FaCircleArrowDown } from 'react-icons/fa6';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { RiPauseCircleFill } from 'react-icons/ri';

export const AudioView: React.FC<PropsType> = memo(
    ({
        fileAudio,
        // barColor = '#4A90E2',
        // barWidth = 2,
        // gap = 2,
        // minBarHeight = 1,
    }) => {
        useLoad(fileAudio);
        // const width = 440;
        // const height = 20;
        //
        // const middleY = height / 2;
        // const canvasRef = useRef<HTMLCanvasElement | null>(null);
        // const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
        //
        // useEffect(() => {
        //     const audioContext = new AudioContext();
        //
        //     async function load() {
        //         const response = await fetch(audioSrc);
        //
        //         if (!response.ok) throw new Error('Ошибка загрузки');
        //         if (!response.body) throw new Error('ReadableStream не поддерживается');
        //
        //         // Получаем общий размер из заголовка
        //         const contentLength = response.headers.get('Content-Length');
        //         const totalBytes = contentLength ? parseInt(contentLength) : null;
        //
        //         let loadedBytes = 0;
        //         const chunks = [];
        //         const reader = response.body.getReader();
        //
        //         const pump = async (): Promise<undefined> => {
        //             const { done, value } = await reader.read();
        //
        //             if (done) {
        //                 // Собираем файл из всех чанков
        //                 // const blob = new Blob(chunks);
        //                 // Далее работа с файлом...
        //                 return;
        //             }
        //
        //             // Обновляем прогресс
        //             loadedBytes += value.length;
        //             chunks.push(value);
        //
        //             console.log({
        //                 loadedMB: (loadedBytes / (1024 * 1024)).toFixed(2),
        //                 totalMB: totalBytes ? (totalBytes / (1024 * 1024)).toFixed(2) : 0,
        //                 isUnknownSize: !totalBytes,
        //             });
        //
        //             // Рекурсивно продолжаем чтение
        //             return pump();
        //         };
        //
        //         pump();
        //
        //         const arrayBuffer = await response.arrayBuffer();
        //         const decoded = await audioContext.decodeAudioData(arrayBuffer);
        //         setAudioBuffer(decoded);
        //     }
        //
        //     load();
        // }, [audioSrc]);
        //
        // useEffect(() => {
        //     if (!canvasRef.current) return;
        //     // if (!audioBuffer || !canvasRef.current) return;
        //
        //     const canvas = canvasRef.current;
        //     const ctx = canvas.getContext('2d');
        //     if (!ctx) return;
        //
        //     // Чистим canvas
        //     ctx.clearRect(0, 0, width, height);
        //
        //     // Получаем данные из первого канала
        //     // const rawData = audioBuffer.getChannelData(0); // float32 array [-1..1]
        //
        //     // const samplesPerBar = Math.floor(rawData.length / (width / (barWidth + gap))); // сколько сэмплов на один столбец
        //     // const barCount = Math.floor(rawData.length / samplesPerBar);
        //
        //     const normalizedData: number[] = [
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.06483079427838846, 0.14198006138562339, 0.13817672657489435, 0.18342209589856293, 0.25579991264622753,
        //         0.2129489639764274, 0.25480176511021313, 0.09219189440330994, 0.04506201542497348, 0.04276913479711097,
        //         0.03345100799559333, 0.02936340291967905, 0.014090396716841433, 0.05894303858543023, 0.08882968162779102,
        //         0.03345100799559333, 0.02936340291967905, 0.014090396716841433, 0.05894303858543023, 0.08882968162779102,
        //         0.03345100799559333, 0.02936340291967905, 0.014090396716841433, 0.05894303858543023, 0.08882968162779102,
        //         0.03345100799559333, 0.02936340291967905, 0.014090396716841433, 0.05894303858543023, 0.08882968162779102,
        //         0.03345100799559333, 0.02936340291967905, 0.014090396716841433, 0.05894303858543023, 0.08882968162779102,
        //         0.09340415302568289, 0.08533862687095714, 0.07569039737750924, 0.09652628855955203, 0.07466942961126569,
        //         0.06801875024540592, 0.05140849734769321, 0.0630552831467646, 0.05888191916008638, 0.08701762309135269,
        //         0.09611082702940817, 0.056817167543776956, 0.061789450210601476, 0.03425338629414448, 0.02827430629813427,
        //         0.02682355679737389, 0.023667051099315117, 0.03335020834736196, 0.032714625331051135, 0.01482176400819449,
        //         0.004322646764048405, 0.002783122715770013, 0.06483079427838846, 0.14198006138562339, 0.13817672657489435,
        //         0.18342209589856293, 0.25579991264622753, 0.06483079427838846, 0.14198006138562339, 0.13817672657489435,
        //         0.18342209589856293, 0.25579991264622753, 0.06483079427838846, 0.14198006138562339, 0.13817672657489435,
        //         0.18342209589856293, 0.25579991264622753, 0.06483079427838846, 0.14198006138562339, 0.13817672657489435,
        //         0.18342209589856293, 0.25579991264622753, 0.06483079427838846, 0.14198006138562339, 0.13817672657489435,
        //         0.18342209589856293, 0.25579991264622753,
        //     ];
        //
        //     // // Вычисляем амплитуду (абсолютное значение среднего сэмпла) или RMS для каждого блока
        //     // for (let i = 0; i < barCount; i++) {
        //     //     let sum = 0;
        //     //     const start = i * samplesPerBar;
        //     //     for (let j = 0; j < samplesPerBar; j++) {
        //     //         const sample = rawData[start + j];
        //     //         sum += Math.abs(sample); // амплитуда
        //     //     }
        //     //     const avg = sum / samplesPerBar;
        //     //     normalizedData.push(avg);
        //     // }
        //
        //     // console.log(normalizedData);
        //
        //     // Нормализуем данные для отображения относительно canvas высоты
        //     const max = Math.max(...normalizedData);
        //     const scale = max > 0 ? height / max : 1;
        //
        //     ctx.fillStyle = barColor;
        //
        //     normalizedData.forEach((val, i) => {
        //         let barHeight = val * scale;
        //         if (barHeight > 0 && barHeight < minBarHeight) barHeight = minBarHeight;
        //
        //         const x = i * (barWidth + gap);
        //
        //         ctx.fillRect(x, middleY, barWidth, barHeight);
        //
        //         ctx.fillRect(x, middleY, barWidth, -barHeight);
        //     });
        // }, [audioBuffer, width, height, barColor, barWidth, gap]);

        return (
            <div className={styles.background}>
                <div className={styles.buttons_background}>
                    <div id={`play_background_${fileAudio.id}`} className={styles.play_background}>
                        <IoPlayCircleSharp id={`play_${fileAudio.id}`} className={styles.play_button} />
                        <RiPauseCircleFill id={`pause_${fileAudio.id}`} className={styles.pause_button} />
                    </div>
                    <div id={`cancel_background_${fileAudio.id}`} className={styles.cancel_background}>
                        <div className={styles.cancel_button_round}>
                            <div className={styles.cancel_button_round_inside}></div>
                        </div>
                        <MdCancel id={`cancel_button_${fileAudio.id}`} className={styles.cancel_button} />
                    </div>
                    <div id={`download_button_${fileAudio.id}`} className={styles.download_button}>
                        <IoPlayCircleSharp className={styles.play_button} />
                        <div className={styles.load_icon_background}>
                            <FaCircleArrowDown className={styles.load_icon} />
                        </div>
                    </div>
                </div>
                <div>
                    {/*<canvas*/}
                    {/*    ref={canvasRef}*/}
                    {/*    width={width}*/}
                    {/*    height={height}*/}
                    {/*    style={{ backgroundColor: 'white', cursor: 'pointer' }}*/}
                    {/*/>*/}
                </div>
            </div>
        );
    },
);
