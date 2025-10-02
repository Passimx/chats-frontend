import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { GrLanguage } from 'react-icons/gr';
import { memo, useCallback } from 'react';
import { useAppAction, useAppSelector } from '../../root/store';
import { IoChatboxEllipsesOutline, IoRocketOutline, IoSettingsOutline } from 'react-icons/io5';
import json from '../../../package.json';
import { TbDatabase } from 'react-icons/tb';
import { ChangeLanguage } from '../../components/change-language';
import { MenuTitle } from '../../components/menu-title';
import { Chats } from '../../components/chats';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { useFileSize } from '../../common/hooks/use-file-size.ts';

export const Settings = memo(() => {
    const { t } = useTranslation();
    const { useMemory, pages, activeTab, systemChatId } = useAppSelector((state) => state.app);
    const chatsLength = useAppSelector((state) => state.chats.chats.length);
    const { setStateApp } = useAppAction();
    const memory = useFileSize(useMemory);

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
            {/*    <div className={styles.item}>*/}
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
                        {t('language')} (<div className={styles.item_value}>{t('language_native')}</div>)
                    </div>
                </div>
                <div className={styles.item} onClick={() => selectMenu(<Chats />)}>
                    <IoChatboxEllipsesOutline className={styles.item_logo} />
                    <div className="text_translate">
                        {t('chats')} (<div className={styles.item_value}>{chatsLength}</div>)
                    </div>
                </div>
                <div className={styles.item}>
                    <TbDatabase className={styles.item_logo} />
                    <div className="text_translate">
                        {t('memory_usage')} (<div className={styles.item_value}>{memory}</div>)
                    </div>
                </div>
                {/*<div className={styles.item}>*/}
                {/*    <MdVpnLock className={styles.item_logo} />*/}
                {/*    <div className="text_translate">Впн</div>*/}
                {/*</div>*/}
            </div>

            <div className={styles.items}>
                <div
                    className={styles.item}
                    onClick={() =>
                        window.open('https://github.com/orgs/Passimx/discussions/new?category=general', '_blank')
                    }
                >
                    <AiOutlineQuestionCircle className={styles.item_logo} />
                    <div className="text_translate">{t('Помощь')}</div>
                </div>
            </div>

            <div className={styles.items}>
                <div className={styles.item} onClick={() => systemChatId && navigate(systemChatId)}>
                    <IoRocketOutline className={styles.item_logo} />
                    <div className="text_translate">
                        {t('about_app')} (
                        <div className={`${styles.item_value} text_translate`}>
                            {t('version')} {json.version}
                        </div>
                        )
                    </div>
                </div>
            </div>
        </div>
    );
});
