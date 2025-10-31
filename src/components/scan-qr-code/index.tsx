import { FC, useCallback, useState } from 'react';
import styles from './index.module.css';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { useAppAction } from '../../root/store';
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner/dist/types';
import { useTranslation } from 'react-i18next';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';

export const ScanQrCode: FC = () => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();
    const devices = useDevices();
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const navigate = useCustomNavigate();

    const onScan = useCallback(([{ rawValue }]: IDetectedBarcode[]) => {
        setIsPaused(true);
        setStateApp({ page: undefined });
        try {
            const object = JSON.parse(rawValue);
            console.log(object);
        } catch (e) {
            if (rawValue.startsWith(window.location.origin)) {
                setTimeout(() => {
                    const destinationUrl = new URL(rawValue);
                    const path = destinationUrl.pathname + destinationUrl.search;
                    navigate(path);
                }, 100);
            }
        }
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
                        sound={false}
                    >
                        <div className={`${styles.qr_hint} ${styles.show} text_translate`}>
                            {t('point_camera_at_qr_code')}
                        </div>
                        {/*<div className={`${styles.camera_background} ${styles.show}`}>*/}
                        {/*    <div className={`${styles.show} ${styles.camera_change_background}`}>*/}
                        {/*        <MdCameraswitch className={`${styles.show} ${styles.camera_change_button}`} />*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </Scanner>
                </div>
            </div>
        );
};
