import { FC, memo, useCallback, useMemo, useState } from 'react';
import styles from './index.module.css';
import { useCreateUser } from './hooks/create-user.hook.ts';
import { EditField } from '../edit-field';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAppAction, useAppSelector } from '../../root/store';
import { TabEnum } from '../../root/store/app/types/state.type.ts';
import { AccountKey } from '../account-key';
import { Animation1 } from '../animation-1';

export const AccountCreate: FC = memo(() => {
    const [isLoading, createUser] = useCreateUser();
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const { setStateApp } = useAppAction();
    const pages = useAppSelector((state) => state.app.pages)?.get(TabEnum.AUTHORIZATION);

    const create = useCallback(async () => {
        if (isLoading) return;
        const data = await createUser(password, name);
        if (!data) return;

        pages?.push(<AccountKey data={data} />);
        if (pages) setStateApp({ pages: new Map<TabEnum, JSX.Element[]>([[TabEnum.AUTHORIZATION, pages]]) });
    }, [isLoading, name, password]);

    const isReadyGenerate = useMemo(() => {
        return name?.length && !!password.length && !!repeatPassword.length && password === repeatPassword;
    }, [password, repeatPassword, name]);

    return (
        <div className={styles.background}>
            <div className={styles.title}>Создание аккаунта</div>
            <div className={styles.main}>
                <div className={styles.center}>
                    <div className={styles.name_background}>
                        <div>Введите имя</div>
                        <EditField value={name} setValue={setName} />
                    </div>
                    <div className={styles.name_background}>
                        <div>Введите пароль</div>
                        <EditField blur={true} value={password} setValue={setPassword} />
                    </div>
                    <div className={styles.name_background}>
                        <div>Подтвердите пароль</div>
                        <EditField blur={true} value={repeatPassword} setValue={setRepeatPassword} />
                    </div>
                    {isLoading ? (
                        <AiOutlineLoading3Quarters id={styles.loading_logo} className={styles.logo} size={100} />
                    ) : (
                        <Animation1 />
                    )}
                </div>
                <div className={styles.button_background}>
                    <div
                        className={`${styles.button} ${!isReadyGenerate && styles.non_active}`}
                        onClick={() => isReadyGenerate && create()}
                    >
                        Создать ключ входа
                    </div>
                </div>
            </div>
        </div>
    );
});
