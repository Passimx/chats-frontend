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
                    <Scanner onScan={onScan} paused={isPaused} scanDelay={1000}>
                        <div className={`${styles.qr_hint} ${styles.show}`}>Наведи камеру на QR-код</div>
                        <div className={`${styles.camera_background} ${styles.show}`}>
                            <div className={`${styles.show} ${styles.camera_change_background}`}>
                                <MdCameraswitch className={`${styles.show} ${styles.camera_change_button}`} />
                            </div>
                        </div>
                    </Scanner>
                </div>
                {/*<button onClick={() => setIsPaused(!isPaused)}>{isPaused ? 'Resume' : 'Pause'} Scanning</button>*/}
                {/*<select onChange={(e) => setSelectedDevice(e.target.value)}>*/}
                {/*    {devices.map((device) => (*/}
                {/*        <option key={device.deviceId} value={device.deviceId}>*/}
                {/*            {device.label || `Camera ${device.deviceId}`}*/}
                {/*        </option>*/}
                {/*    ))}*/}
                {/*</select>*/}
                {/*<Scanner*/}
                {/*    components={{*/}
                {/*        // audio: true, // Play beep sound on scan*/}
                {/*        onOff: true, // Show camera on/off button*/}
                {/*        torch: true, // Show torch/flashlight button (if supported)*/}
                {/*        zoom: true, // Show zoom control (if supported)*/}
                {/*        finder: true, // Show finder overlay*/}
                {/*    }}*/}
                {/*    constraints={{*/}
                {/*        deviceId: selectedDevice,*/}
                {/*    }}*/}
                {/*    // sound="data:audio/mp3;base64,YOUR_BASE64_AUDIO_HERE"*/}
                {/*/>*/}
            </div>
        );
};
