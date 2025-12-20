import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';

export const LogOut = memo(() => {
    const { t } = useTranslation();

    return (
        <div className={styles.background}>
            {t('sure_about_log_out')}
            <div className={styles.buttons}>
                <div className={styles.button}>{t('yes')}</div>
                <div className={`${styles.button} ${styles.no_button}`}>{t('no')}</div>
            </div>
        </div>
    );
});
