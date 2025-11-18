import { FC, memo, useEffect, useMemo, useRef } from 'react';
import QRCode from 'qrcode';
import styles from './index.module.css';
import { PropsType } from './types';
import { FiShare } from 'react-icons/fi';
import { shareFile } from '../../root/api/files';
import { MimetypeEnum } from '../../root/types/files/types.ts';
import { IoCopyOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

function setupHiDPICanvas(canvas: HTMLCanvasElement, width: number, height: number) {
    const ratio = 3;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return ctx;

    ctx.scale(ratio, ratio);

    return ctx;
}

export const QrCode: FC<PropsType> = memo(({ url, text }) => {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const size = Math.min(window.innerWidth, window.innerHeight, 400) - 8;

    const visibleText = useMemo(() => {
        if (!text) return '';
        if (text.length <= 20) return text;
        return text.slice(0, 10) + '...' + text.slice(-10);
    }, [text]);

    // todo
    // вынести в подкомпонент
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        canvas.width = size;
        canvas.height = size;

        const textAreaHeight = 20;
        const ctx = setupHiDPICanvas(canvas, size, size + textAreaHeight);

        if (!ctx) return;

        ctx.beginPath();
        ctx.roundRect(0, 0, size, size + textAreaHeight, 16);
        ctx.clip();

        const qrCanvas = document.createElement('canvas');

        QRCode.toCanvas(qrCanvas, url, {
            errorCorrectionLevel: 'H',
            width: size,
            color: {
                light: '#ffffff',
                dark: '#062846',
            },
        }).then(() => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(qrCanvas, 0, 0);

            const logo = new Image();
            logo.src = '/assets/icons/256.png';
            logo.onload = () => {
                const logoSize = size * 0.8;
                ctx.globalAlpha = 0.5;
                ctx.drawImage(logo, (size - logoSize) / 2, (size - logoSize) / 2, logoSize, logoSize);
                ctx.globalAlpha = 1.0;

                if (visibleText) {
                    ctx.font = 'bold 20px sans-serif';
                    ctx.fillStyle = '#0098EA';
                    ctx.textAlign = 'center';
                    ctx.fillText(visibleText, size / 2, size + 8);
                }
            };
        });
    }, [url, visibleText]);

    const share = () => {
        canvasRef?.current?.toBlob(async (blob) => {
            if (!blob) return;
            const newFile = new File([blob], 'qrcode.png', { type: MimetypeEnum.PNG });
            shareFile({ originalName: newFile.name, mimeType: MimetypeEnum.PNG }, blob);
        });
    };

    return (
        <div className={styles.background}>
            <canvas ref={canvasRef} />
            <div className={styles.buttons}>
                <div
                    className={`${styles.button} ${styles.copy_button}`}
                    onClick={() => navigator.clipboard.writeText(url)}
                >
                    <div className={'text_translate'}>{t('copy_link')}</div>
                    <IoCopyOutline />
                </div>
                <div className={`${styles.button} ${styles.share_button}`} onClick={() => share()}>
                    <div className={'text_translate'}>{t('share')}</div>
                    <FiShare />
                </div>
            </div>
        </div>
    );
});
