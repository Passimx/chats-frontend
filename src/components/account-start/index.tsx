import { FC, memo, useCallback } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { TabEnum } from '../../root/store/app/types/state.type.ts';
import { CreateAccount } from './create-account';

export const AccountStart: FC = memo(() => {
    const { setStateApp } = useAppAction();
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);

    const createAccount = useCallback(() => {
        pages?.push(<CreateAccount />);
        if (pages) setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, pages]]) });
    }, [pages]);

    return (
        <div className={styles.background}>
            <div className={styles.auth_text_1}>Вход PassimX</div>
            <div></div>
            <div className={styles.auth_text_2}>Защитите свои данные</div>
            <div className={styles.create_account_buttons_background}>
                <div className={styles.create_account_button}>
                    <div className={styles.create_account_button} onClick={createAccount}>
                        Создать аккаунт
                    </div>
                </div>
                <div className={styles.create_account_button}>
                    <div className={styles.create_account_button}>Войти с помощью ключа</div>
                </div>
            </div>
        </div>
    );
});
