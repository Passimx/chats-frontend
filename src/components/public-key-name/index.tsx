import { FC, memo, useCallback } from 'react';
import styles from './index.module.css';
import { PropsType } from './types.ts';
import { useAppAction } from '../../root/store';
import { getChatByName } from '../../root/api/chats';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { useShortText } from '../../common/hooks/use-short-text.hook.ts';
import { EventsEnum } from '../../root/types/events/events.enum.ts';

export const PublicKeyName: FC<PropsType> = memo(({ name }) => {
    const shortName = useShortText(name);
    const { postMessageToBroadCastChannel } = useAppAction();
    const navigate = useCustomNavigate();

    const click = useCallback(async () => {
        const response = await getChatByName(name);
        if (!response.success) return postMessageToBroadCastChannel({ event: EventsEnum.SHOW_TEXT, data: 'no_chats' });
        const chat = response.data;

        navigate(`/${chat.name}`, { state: chat });
    }, []);

    return (
        <span className={styles.background} onClick={click}>
            @{shortName}
        </span>
    );
});
