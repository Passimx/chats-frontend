import { FC, memo, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import styles from './index.module.css';
import { PropsType } from './types.ts';

export const QrCode: FC<PropsType> = memo(({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const size = Math.min(window.innerWidth, window.innerHeight, 400) - 8;

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, data, {
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
    }, [data]);

    return (
        <div className={styles.background} style={{ height: size, width: size }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
});
