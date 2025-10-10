import { useAppAction } from '../../../store';
import { useEffect } from 'react';

export const useBattery = () => {
    const { setStateApp } = useAppAction();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        navigator?.getBattery()?.then((battery) => {
            setStateApp({ batteryLevel: battery.level * 100 });
            setStateApp({ batteryCharging: battery.charging });

            battery.addEventListener('levelchange', () => setStateApp({ batteryLevel: battery.level * 100 }));
            battery.addEventListener('chargingchange', () => setStateApp({ batteryCharging: battery.charging }));
        });
    }, []);
};
