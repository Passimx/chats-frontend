import { FC, memo, useCallback } from 'react';
import styles from './index.module.css';
import { PropsType } from './types.ts';
import { useAppAction } from '../../root/store';
import { NotFoundUsername } from '../not-found-username';
import { getChatByName } from '../../root/api/chats';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';

export const PublicKeyName: FC<PropsType> = memo(({ name }) => {
    const { setStateApp } = useAppAction();
    const navigate = useCustomNavigate();

    const click = useCallback(async () => {
        const response = await getChatByName(name);
        if (!response.success) return setStateApp({ page: <NotFoundUsername /> });
        const chat = response.data;

        navigate(`/${chat.name}`, { state: chat });
    }, []);

    return (
        <div className={styles.background} onClick={click}>
            @{name}
        </div>
    );
});
