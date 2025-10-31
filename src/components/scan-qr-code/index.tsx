import { FC, useCallback, useState } from 'react';
import styles from './index.module.css';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { useAppAction } from '../../root/store';
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner/dist/types';
import { MdCameraswitch } from 'react-icons/md';

export const ScanQrCode: FC = () => {
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const { setStateApp } = useAppAction();
    const devices = useDevices();

    const onScan = useCallback(([result]: IDetectedBarcode[]) => {
        setIsPaused(true);
        setStateApp({ page: undefined });
        console.log(result.rawValue);
    }, []);

    if (devices.length)
        return (
            <div className={styles.background}>
                <div className={styles.container}>
                    <Scanner
                        onScan={onScan}
                        paused={isPaused}
                        scanDelay={1000}
                        components={{ torch: true, zoom: true, finder: true }}
                    >
                        <div className={`${styles.qr_hint} ${styles.show}`}>Наведи камеру на QR-код</div>
                        <div className={`${styles.camera_background} ${styles.show}`}>
                            <div className={`${styles.show} ${styles.camera_change_background}`}>
                                <MdCameraswitch className={`${styles.show} ${styles.camera_change_button}`} />
                            </div>
                        </div>
                    </Scanner>
                </div>
            </div>
        );
};
