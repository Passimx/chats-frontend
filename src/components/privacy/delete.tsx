import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRGenerator: React.FC<{ value: string }> = ({ value }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, value, {
                errorCorrectionLevel: 'H',
                width: 350,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            }).catch((err) => {
                console.error('Failed to generate QR:', err);
            });
        }
    }, [value]);

    return <canvas ref={canvasRef}></canvas>;
};

export default QRGenerator;
