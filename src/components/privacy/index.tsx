import { FC } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { useAppSelector } from '../../root/store';

export const Privacy: FC = () => {
    const publicKey = useAppSelector((state) => state.app.keyInf?.publicKey);

    if (publicKey)
        return (
            <div className={styles.background}>
                <MenuTitle icon={<RiShieldKeyholeLine />} title={'privacy_policy'} />
                {/*<div>Добавить пароль при входе в приложение</div>*/}
                {/*<Checkbox*/}
                {/*    checked={!!isCheckVerified}*/}
                {/*    onChange={() => changeSettings({ isCheckVerified: !isCheckVerified })}*/}
                {/*/>*/}
            </div>
        );
};
