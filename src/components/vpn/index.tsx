import { FC, memo } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { TbLogs } from 'react-icons/tb';

export const Vpn: FC = memo(() => {
    // window.location.href = `${Envs.filesServiceUrl}/vpn`
    return (
        <div className={styles.background}>
            <MenuTitle icon={<TbLogs />} title={'vpn'} />
        </div>
    );
});
