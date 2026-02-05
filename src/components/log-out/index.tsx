import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { useAppAction } from '../../root/store';
import { logout } from '../../root/api/auth';

export const LogOut = memo(() => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();

    return (
        <div className={styles.background}>
            {t('sure_about_log_out')}
            <div className={styles.buttons}>
                <div className={styles.button} onClick={logout}>
                    {t('yes')}
                </div>
                <div
                    className={`${styles.button} ${styles.no_button}`}
                    onClick={() => setStateApp({ page: undefined })}
                >
                    {t('no')}
                </div>
            </div>
        </div>
    );
});
