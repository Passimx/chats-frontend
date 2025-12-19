import { FC, memo, useCallback } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { TabEnum } from '../../root/store/app/types/state.type.ts';
import { CreateAccount } from './create-account';
import { useTranslation } from 'react-i18next';

export const AccountStart: FC = memo(() => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);

    const createAccount = useCallback(() => {
        pages?.push(<CreateAccount />);
        if (pages) setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, pages]]) });
    }, [pages]);

    return (
        <div className={styles.background}>
            <div className={styles.auth_text_1}>{t('login_to_PassimX')}</div>
            <div></div>
            <div className={styles.auth_text_2}>{t('protect_your_data')}</div>
            <div className={styles.create_account_buttons_background}>
                <div className={styles.create_account_button}>
                    <div className={styles.create_account_button} onClick={createAccount}>
                        {t('create_account')}
                    </div>
                </div>
                <div className={styles.create_account_button}>
                    <div className={styles.create_account_button}>{t('log_in_with_a_key')}</div>
                </div>
            </div>
        </div>
    );
});
