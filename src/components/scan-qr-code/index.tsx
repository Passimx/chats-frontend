import { FC, useCallback, useState } from 'react';
import styles from './index.module.css';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { useAppAction } from '../../root/store';
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner/dist/types';
import { useTranslation } from 'react-i18next';

function isSameSiteURL(urlString: string) {
    if (urlString.startsWith('/') && !urlString.startsWith('//')) {
        return true;
    }

    try {
        const destinationUrl = new URL(urlString);
        console.log([destinationUrl.host, window.location.host]);
        return destinationUrl.host === window.location.host;
    } catch (e) {
        console.log(123);
        return false;
    }
}

export const ScanQrCode: FC = () => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();
    const devices = useDevices();
    const [isPaused, setIsPaused] = useState<boolean>(false);

    const onScan = useCallback(([result]: IDetectedBarcode[]) => {
        setIsPaused(true);
        setStateApp({ page: undefined });
        console.log(result.rawValue);
        console.log(isSameSiteURL(result.rawValue));
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
