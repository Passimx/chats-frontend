import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { useAppAction } from '../../root/store';
import { EventsEnum } from '../../root/types/events/events.enum.ts';

export const LogOut = memo(() => {
    const { t } = useTranslation();
    const { postMessageToBroadCastChannel, setStateApp } = useAppAction();

    return (
        <div className={styles.background}>
            {t('sure_about_log_out')}
            <div className={styles.buttons}>
                <div
                    className={styles.button}
                    onClick={() => {
                        postMessageToBroadCastChannel({ event: EventsEnum.LOGOUT });
                        setStateApp({ page: undefined });
                    }}
                >
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
