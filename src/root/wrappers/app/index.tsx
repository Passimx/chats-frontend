import { FC, useEffect } from 'react';
import styles from './index.module.css';
import Chats from '../../../modules/chats';
import { useBroadcastChannel } from './hooks/use-broadcast-channel.ts';
import { useTranslation } from './hooks/use-translation.ts';
import { useOnline } from './hooks/use-online.ts';
import { useParams } from 'react-router-dom';
import { useIndexDbHook } from './hooks/use-index-db.hook.ts';
import { useListenAndUpdateChats } from './hooks/use-listen-and-update-chats.hook.ts';
import { useIsPhone } from './hooks/use-is-phone.hook.ts';
import { PropsType } from './types/props.type.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';
import { useCheckSystemChat } from './hooks/use-check-system-chat.hook.ts';
import { Menu } from '../../../components/menu';
import { useTelegram } from '../../../modules/telegram';

const AppWrapper: FC<PropsType> = ({ children }) => {
    useListenAndUpdateChats();
    useBroadcastChannel();
    useIndexDbHook();
    useOnline();
    useIsPhone();
    useCheckSystemChat();
    useTelegram();

    const isLoaded = useTranslation();
    const { id } = useParams();

    useEffect(changeHead, []);

    const hideMenu = () => {
        if (!id) return;
        document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
    };

    if (isLoaded)
        return (
            <div id={styles.background}>
                <div id={styles.menu}>
                    <Chats />
                    <Menu />
                </div>
                <div id={styles.chat} onClick={hideMenu}>
                    {children}
                </div>
            </div>
        );
};

export default AppWrapper;
