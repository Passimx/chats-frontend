import { FC, useCallback, useEffect } from 'react';
import styles from './index.module.css';
import Chats from '../../../modules/chats';
import { useBroadcastChannel } from './hooks/use-broadcast-channel.ts';
import { useTranslation } from './hooks/translations/use-translation.ts';
import { useOnline } from './hooks/use-online.ts';
import { useParams } from 'react-router-dom';
import { useIndexDbHook } from './hooks/use-index-db.hook.ts';
import { useListenAndUpdateChats } from './hooks/use-listen-and-update-chats.hook.ts';
import { useIsPhone } from './hooks/use-is-phone.hook.ts';
import { PropsType } from './types/props.type.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';
import { useRequiredChats } from './hooks/use-required-chats.hook.ts';
import { Menu } from '../../../components/menu';
import { useMobileKeyboard } from './hooks/use-mobile-keyboard.hook.ts';
import { AudioPlayer } from '../../contexts/audio-player';
import { useMemory } from './hooks/use-memory.ts';
import { Settings } from '../../../pages/settings';
import { PageItem } from '../../../components/page-item';
import { TabEnum } from '../../store/app/types/state.type.ts';
import { PreviewMediaContext } from '../../../components/preview-media-context';
import { useIsIos } from './hooks/use-is-ios.hook.ts';
import { useBattery } from './hooks/use-battery.hook.ts';
import { useSettings } from './hooks/use-settings.hook.ts';
import { useUpdateBadge } from './hooks/use-update-badge.hook.ts';
import { useCatchLogs } from './hooks/use-catch-logs.hook.ts';
import { useKeys } from './hooks/use-keys.hook.ts';
import { useUpdateStaticCache } from './hooks/use-update-static-cache.hook.ts';
import { TopElements } from '../../../components/top-elements';

const AppWrapper: FC<PropsType> = ({ children }) => {
    // updating chat information
    useListenAndUpdateChats();
    // add broadcast channel and iframe with Websocket connection
    useBroadcastChannel();
    // get chat information from local storage
    useIndexDbHook();
    // updating online/offline
    useOnline();
    // updating window size
    useIsPhone();
    // add required chat
    useRequiredChats();
    // logic for Telegram App
    // useTelegram();
    // logic for mobile keyboard
    useMobileKeyboard();
    // logic for usage memory
    useMemory();
    // todo
    // перенести на сервер
    useEffect(changeHead, []);
    // catch all app log-list
    useCatchLogs();
    // calculate ios device
    useIsIos();
    // battery Saver Mode
    useBattery();
    // get user settings
    useSettings();
    // update badge
    useUpdateBadge();
    // get RSA keys
    useKeys();
    // update static files in cache storage
    useUpdateStaticCache();
    // verity when open app
    // const [isAuth] = useVerify();

    // set language
    const isLoaded = useTranslation();
    const { name } = useParams();

    const hideMenu = useCallback(() => {
        if (!name) return;
        document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
    }, [name]);

    if (isLoaded)
        return (
            <AudioPlayer>
                <div id={styles.background}>
                    <PreviewMediaContext>
                        <TopElements />
                        <div id={styles.menu}>
                            <div id={styles.pages}>
                                {/*<PageItem public-key-name={TabEnum.SERVICES}>*/}
                                {/*    <Services />*/}
                                {/*</PageItem>*/}
                                <PageItem name={TabEnum.CHATS}>
                                    <Chats />
                                </PageItem>
                                <PageItem name={TabEnum.SETTINGS}>
                                    <Settings />
                                </PageItem>
                            </div>
                            <Menu />
                        </div>
                        <div id={styles.chat} onClick={hideMenu}>
                            {children}
                        </div>
                    </PreviewMediaContext>
                </div>
            </AudioPlayer>
        );
};

export default AppWrapper;
