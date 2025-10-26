import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { GrLanguage } from 'react-icons/gr';
import { memo, useCallback, useMemo } from 'react';
import { useAppAction, useAppSelector } from '../../root/store';
import { IoChatboxEllipsesOutline, IoRocketOutline, IoSettingsOutline } from 'react-icons/io5';
import json from '../../../package.json';
import { TbDatabase, TbLogs } from 'react-icons/tb';
import { ChangeLanguage } from '../../components/change-language';
import { MenuTitle } from '../../components/menu-title';
import { Chats } from '../../components/chats';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { getFileSize } from '../../common/hooks/get-file-size.ts';
import { LogList } from '../../components/log-list';
import { EnvironmentEnum, Envs } from '../../common/config/envs/envs.ts';
import { Memory } from '../../components/memory';

export const Settings = memo(() => {
    const { t } = useTranslation();
    const { cacheMemory, pages, activeTab, systemChatId, logs } = useAppSelector((state) => state.app);
    const chatsLength = useAppSelector((state) => state.chats.chats.length);
    const { setStateApp } = useAppAction();

    const cache = useMemo(() => {
        const [memory, unit] = getFileSize(cacheMemory);
        return `${memory} ${t(unit)}`;
    }, [cacheMemory]);

    const navigate = useCustomNavigate();

    const selectMenu = useCallback(
        (page: JSX.Element) => {
            const newArray = [page];
            const newPages = new Map(pages);
            newPages.set(activeTab, newArray);
            setStateApp({ pages: newPages });
        },
        [pages, activeTab],
    );

    return (
        <div id={styles.background}>
            <MenuTitle icon={<IoSettingsOutline />} title={'settings'} />
            {/*<div className={styles.items}>*/}
            {/*    <div className={styles.item} onClick={() => selectMenu(<Privacy />)}>*/}
            {/*        <RiShieldKeyholeLine className={styles.item_logo} />*/}
            {/*        <div className="text_translate">{t('privacy_policy')}</div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*todo*/}
            {/*<div className={styles.items}>*/}
            {/*    <div className={styles.item}>*/}
            {/*        <IoWalletOutline className={styles.item_logo} />*/}
            {/*        <div className="text_translate">*/}
            {/*            {t('wallet')} (<div className={styles.item_value}>6K $</div>)*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className={styles.items}>
                <div className={styles.item} onClick={() => selectMenu(<ChangeLanguage />)}>
                    <GrLanguage className={styles.item_logo} />
                    <div className="text_translate">
                        {t('language')}
                        <div className={styles.item_value}>&nbsp;{t('language_native')}</div>
                    </div>
                </div>
                <div className={styles.item} onClick={() => selectMenu(<Chats />)}>
                    <IoChatboxEllipsesOutline className={styles.item_logo} />
                    <div className="text_translate">
                        {t('chats')}
                        <div className={styles.item_value}>&nbsp;{chatsLength}</div>
                    </div>
                </div>
                <div className={styles.item} onClick={() => selectMenu(<Memory />)}>
                    <TbDatabase className={styles.item_logo} />
                    <div className="text_translate">
                        {t('memory_usage')}
                        <div className={styles.item_value}>&nbsp;{cache}</div>
                    </div>
                </div>
                {Envs.environment !== EnvironmentEnum.PRODUCTION && (
                    <div className={styles.item} onClick={() => selectMenu(<LogList />)}>
                        <TbLogs className={styles.item_logo} />
                        <div className="text_translate">
                            {t('app_logs')}
                            {logs?.length && <div className={styles.item_value}>&nbsp;{logs.length}</div>}
                        </div>
                    </div>
                )}
                {/*{batteryLevel && (*/}
                {/*    <div className={styles.item} onClick={() => selectMenu(<BatterySaver />)}>*/}
                {/*        <MdBatteryCharging20 className={styles.item_logo} />*/}
                {/*        <div className="text_translate">*/}
                {/*            {t('battery_saver_mode')}*/}
                {/*            {batteryLevel && (*/}
                {/*                <div className={styles.item_value}>&nbsp;{batterySaverMode ? t('on') : t('off')}</div>*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
                {/*{isStandalone && (*/}
                {/*    <div className={styles.item} onClick={() => selectMenu(<Vpn />)}>*/}
                {/*        <MdVpnLock className={styles.item_logo} />*/}
                {/*        <div className="text_translate">{t('vpn')}</div>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            <div className={styles.items}>
                <div
                    className={styles.item}
                    onClick={() =>
                        window.open('https://github.com/orgs/Passimx/discussions/new?category=general', '_blank')
                    }
                >
                    <AiOutlineQuestionCircle className={styles.item_logo} />
                    <div className="text_translate">{t('help')}</div>
                </div>
            </div>

            <div className={styles.items}>
                <div className={styles.item} onClick={() => systemChatId && navigate(systemChatId)}>
                    <IoRocketOutline className={styles.item_logo} />
                    <div className="text_translate">
                        {t('about_app')}
                        <div className={`${styles.item_value} text_translate`}>
                            &nbsp;{`(${t('version')} ${json.version})`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
