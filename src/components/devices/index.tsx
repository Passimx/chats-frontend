import { FC, memo } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { useTranslation } from 'react-i18next';
import { PiDevicesBold } from 'react-icons/pi';
import { IoExitOutline } from 'react-icons/io5';
import { useAppAction, useAppSelector } from '../../root/store';
import { LogOut } from '../log-out';
import { FaChrome, FaEdge, FaFirefoxBrowser, FaInternetExplorer, FaOpera, FaSafari, FaYandex } from 'react-icons/fa';
import { IoMdBrowsers } from 'react-icons/io';
import { ImMobile } from 'react-icons/im';

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
                        <div key={session.id} className={styles.item}>
                            {session.userAgent.indexOf('Android') > -1 ? (
                                <>
                                    <ImMobile className={styles.item_logo} />
                                    <div>Android</div>
                                </>
                            ) : session.userAgent.indexOf('iPhone') > -1 ? (
                                <>
                                    <ImMobile className={styles.item_logo} />
                                    <div>iPhone</div>
                                </>
                            ) : session.userAgent.indexOf('iPad') > -1 ? (
                                <>
                                    <ImMobile className={styles.item_logo} />
                                    <div>iPad</div>
                                </>
                            ) : session.userAgent.indexOf('iPod') > -1 ? (
                                <>
                                    <ImMobile className={styles.item_logo} />
                                    <div>iPod</div>
                                </>
                            ) : session.userAgent.indexOf('Mobi') > -1 ? (
                                <>
                                    <ImMobile className={styles.item_logo} />
                                    <div>Mobile</div>
                                </>
                            ) : session.userAgent.indexOf('YaBrowser') > -1 ? (
                                <>
                                    <FaYandex className={styles.item_logo} />
                                    <div>Yandex Browser</div>
                                </>
                            ) : session.userAgent.indexOf('Chrome') > -1 ? (
                                <>
                                    <FaChrome className={styles.item_logo} />
                                    <div>Google Chrome</div>
                                </>
                            ) : session.userAgent.indexOf('Firefox') > -1 ? (
                                <>
                                    <FaFirefoxBrowser className={styles.item_logo} />
                                    <div>Mozilla Firefox</div>
                                </>
                            ) : session.userAgent.indexOf('Safari') > -1 ? (
                                <>
                                    <FaSafari className={styles.item_logo} />
                                    <div>Safari</div>
                                </>
                            ) : session.userAgent.indexOf('Opera') > -1 || session.userAgent.indexOf('OPR') > -1 ? (
                                <>
                                    <FaOpera className={styles.item_logo} />
                                    <div>Opera</div>
                                </>
                            ) : session.userAgent.indexOf('Edg') > -1 ? (
                                <>
                                    <FaEdge className={styles.item_logo} />
                                    <div>Microsoft Edge</div>
                                </>
                            ) : session.userAgent.indexOf('Trident') > -1 ? (
                                <>
                                    <FaInternetExplorer className={styles.item_logo} />
                                    <div>Internet Explorer</div>
                                </>
                            ) : (
                                <>
                                    <IoMdBrowsers className={styles.item_logo} />
                                    <div>Browser</div>
                                </>
                            )}
                            <div className="text_translate">{session.isOnline ? t('online') : ''}</div>
                            <div className={`${styles.item_date} ${styles.item_opacity}`}>
                                {new Date(session.updatedAt).toLocaleString()}
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
