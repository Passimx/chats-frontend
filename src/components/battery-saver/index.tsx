import { FC, memo } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { MdBatteryCharging20 } from 'react-icons/md';

export const BatterySaver: FC = memo(() => {
    return (
        <div className={styles.background}>
            <MenuTitle icon={<MdBatteryCharging20 />} title={'battery_saver'} />
        </div>
    );
});
