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

    const onScan = useCallback(async ([{ rawValue }]: IDetectedBarcode[]) => {
        setIsPaused(true);
        setStateApp({ page: undefined });

        setTimeout(() => {
            const destinationUrl = new URL(rawValue);
            const path = destinationUrl.pathname + destinationUrl.search;
            navigate(path);
        }, 100);
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
                        styles={{
                            container: { width: '100%' },
                            video: { width: '100%' },
                        }}
                    >
                        <div className={`${styles.qr_hint} ${styles.show} text_translate`}>
                            {t('point_camera_at_qr_code')}
                        </div>
                    </Scanner>
                </div>
            </div>
        );
};
