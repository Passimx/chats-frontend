import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { GrLanguage } from 'react-icons/gr';
import { memo, useCallback, useMemo } from 'react';
import { useAppAction, useAppSelector } from '../../root/store';
import { IoChatboxEllipsesOutline, IoRocketOutline, IoSettingsOutline, IoWalletOutline } from 'react-icons/io5';
import { TbBackground, TbDatabase, TbLogs } from 'react-icons/tb';
import { ChangeLanguage } from '../../components/change-language';
import { MenuTitle } from '../../components/menu-title';
import { Chats } from '../../components/chats';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { getFileSize } from '../../common/hooks/get-file-size.ts';
import { LogList } from '../../components/log-list';
import { EnvironmentEnum, Envs } from '../../common/config/envs/envs.ts';
import { Memory } from '../../components/memory';
import { LuStar } from 'react-icons/lu';
import { UserInf } from '../../components/user-inf';
import { Appearance } from '../../components/appearance';
import { MenuPadding } from '../../components/menu/compenents/menu-padding/index.tsx';
import { PiDevicesBold } from 'react-icons/pi';
import { Devices } from '../../components/devices/index.tsx';

export const Settings = memo(() => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();
    const chatsLength = useAppSelector((state) => state.chats.chats.length);
    const userName = useAppSelector((state) => state.user.userName);
    const { cacheMemory, pages, activeTab, systemChatName, logs } = useAppSelector((state) => state.app);

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

            <div id={styles.menu}>
                <div className={styles.items}>
                    <UserInf />
                </div>

                {/*<div className={styles.items}>*/}
                {/*    <div className={styles.item} onClick={() => selectMenu(<Privacy />)}>*/}
                {/*        <RiShieldKeyholeLine className={styles.item_logo} />*/}
                {/*        <div className="text_translate">{t('privacy_policy')}</div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className={styles.items}>*/}
                {/*    <div className={styles.item}>*/}
                {/*        <IoWalletOutline className={styles.item_logo} />*/}
                {/*        <div className="text_translate">*/}
                {/*            {t('wallet')} (<div className={styles.item_value}>6K $</div>)*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className={styles.items}>
                    <div className={styles.item} onClick={() => selectMenu(<Chats />)}>
                        <IoChatboxEllipsesOutline className={styles.item_logo} />
                        <div className="text_translate">
                            {t('chats')}
                            <div className={styles.item_value}>&nbsp;{chatsLength}</div>
                        </div>
                    </div>
                    <div
                        className={styles.item}
                        onClick={() => {
                            if (userName) navigate(userName);
                        }}
                    >
                        <LuStar className={styles.item_logo} />
                        <div className="text_translate">{t('favorites')}</div>
                    </div>
                    <div className={styles.item} onClick={() => selectMenu(<Appearance />)}>
                        <TbBackground className={styles.item_logo} />
                        <div className="text_translate">{t('appearance')}</div>
                    </div>
                    <div className={styles.item} onClick={() => selectMenu(<ChangeLanguage />)}>
                        <GrLanguage className={styles.item_logo} />
                        <div className="text_translate">
                            {t('language')}
                            <div className={styles.item_value}>&nbsp;{t('language_native')}</div>
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
                    <div className={styles.item}>
                        <IoWalletOutline className={styles.item_logo} />
                        <div className="text_translate">{t('wallet')}</div>
                    </div>
                    <div className={styles.item} onClick={() => selectMenu(<Devices />)}>
                        <PiDevicesBold className={styles.item_logo} />
                        <div className="text_translate">{t('devices')}</div>
                    </div>
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
                    <div className={styles.item} onClick={() => systemChatName && navigate(systemChatName)}>
                        <IoRocketOutline className={styles.item_logo} />
                        <div className="text_translate">
                            {t('about_app')}
                            <div className={`${styles.item_value} text_translate`}>
                                &nbsp;{`(${t('version')} ${Envs.version})`}
                            </div>
                        </div>
                    </div>
                </div>

                <MenuPadding />
            </div>
        </div>
    );
});
