import { FC, memo, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { PropsType } from './types.ts';
import styles from './index.module.css';

export const QrCode: FC<PropsType> = memo(({ value }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const size = Math.min(window.innerWidth, window.innerHeight, 400) - 16;

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, JSON.stringify(value), {
                errorCorrectionLevel: 'H',
                width: size,
                color: {
                    light: '#ffffff',
                    dark: '#062846',
                },
            }).catch((err) => {
                console.error('Failed to generate QR:', err);
            });
        }
    }, [value]);

    return (
        <div className={styles.background} style={{ height: size, width: size }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
});
