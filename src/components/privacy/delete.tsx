import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

type ScanValueType = { publicKey?: string };

type Props = {
    value: ScanValueType;
};

const QRGenerator: React.FC<Props> = ({ value }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, JSON.stringify(value), {
                errorCorrectionLevel: 'H',
                width: 350,
                margin: 2,
                color: {
                    light: '#ffffff',
                    dark: '#062846',
                },
            }).catch((err) => {
                console.error('Failed to generate QR:', err);
            });
        }
    }, [value]);

    return <canvas ref={canvasRef}></canvas>;
};

export default QRGenerator;
