import { FC, memo, useCallback } from 'react';
import styles from './index.module.css';
import { PropsType } from './types.ts';
import { useAppAction } from '../../root/store';
import { NotFoundUsername } from '../not-found-username';
import { getChatByName } from '../../root/api/chats';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { useShortText } from '../../common/hooks/use-short-text.hook.ts';

export const PublicKeyName: FC<PropsType> = memo(({ name }) => {
    const { setStateApp } = useAppAction();
    const navigate = useCustomNavigate();
    const shortName = useShortText(name);

    const click = useCallback(async () => {
        const response = await getChatByName(name);
        if (!response.success) return setStateApp({ page: <NotFoundUsername /> });
        const chat = response.data;

        navigate(`/${chat.name}`, { state: chat });
    }, []);

    return (
        <span className={styles.background} onClick={click}>
            @{shortName}
        </span>
    );
});
