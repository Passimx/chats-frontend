import { FC, memo } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { useTranslation } from 'react-i18next';
import { PiDevicesBold } from 'react-icons/pi';
import { IoExitOutline } from 'react-icons/io5';
import { useAppAction, useAppSelector } from '../../root/store';
import { LogOut } from '../log-out';

export const Devices: FC = memo(() => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();
    const sessions = useAppSelector((state) => state.user.sessions);

    return (
        <div className={styles.background}>
            <MenuTitle icon={<PiDevicesBold />} title={'devices'} />
            <div className={styles.settings_background}>
                {sessions &&
                    [...sessions].reverse().map((session) => (
                        <div key={session.id} className={styles.tab}>
                            <div className={styles.item}>
                                <div className={`${styles.header} text_translate`}>{t('online')}</div>
                                <div className={`${styles.value} text_translate`}>
                                    {session.isOnline ? t('yes') : t('no')}
                                </div>
                            </div>
                            <div className={styles.item}>
                                <div className={`${styles.header} text_translate`}>{t('device')}</div>
                                <div className={styles.value}>{session.userAgent}</div>
                            </div>
                            <div className={styles.item}>
                                <div className={`${styles.header} text_translate`}>{t('last_visit')}</div>
                                <div className={styles.value}>{new Date(session.updatedAt).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className={styles.button_background}>
                <div className={styles.button} onClick={() => setStateApp({ page: <LogOut /> })}>
                    <div className={styles.button_text}>
                        <IoExitOutline size={24} />
                        <div className={'text_translate'}>{t('log_out')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
});
