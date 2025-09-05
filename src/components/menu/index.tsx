import { memo, useCallback } from 'react';
import styles from './index.module.css';
import { GoMail } from 'react-icons/go';
import { useTranslation } from 'react-i18next';
import { useAppAction, useAppSelector } from '../../root/store';
import { IoSettingsOutline } from 'react-icons/io5';
import { TabEnum } from '../../root/store/app/types/state.type.ts';

export const Menu = memo(() => {
    const { t } = useTranslation();
    const { activeTab, pages } = useAppSelector((state) => state.app);
    const messageCount = useAppSelector((state) => state.chats.messageCount);
    const { setStateApp } = useAppAction();

    const onClickMenuTab = useCallback(
        (tab: TabEnum) => {
            setStateApp({ activeTab: tab });

            if (tab === activeTab) {
                const newPages = new Map(pages);
                newPages.set(activeTab, []);
                setStateApp({ pages: newPages });
            }
        },
        [activeTab, pages],
    );

    return (
        <div id={styles.menu}>
            {/*<div*/}
            {/*    className={`${styles.menu_item} ${activeTab === TabEnum.SERVICES && styles.menu_item_active}`}*/}
            {/*    onClick={() => onClickMenuTab(TabEnum.SERVICES)}*/}
            {/*>*/}
            {/*    <div className={styles.menu_item_inner}>*/}
            {/*        <IoIosApps size={24} />*/}
            {/*    </div>*/}
            {/*    <div className={`text_translate ${styles.menu_item_inner_text}`}>{t('services')}</div>*/}
            {/*</div>*/}
            <div
                className={`${styles.menu_item} ${activeTab === TabEnum.CHATS && styles.menu_item_active}`}
                onClick={() => onClickMenuTab(TabEnum.CHATS)}
            >
                {messageCount > 0 && (
                    <div id={styles.message_count}>
                        <div id={styles.count}>{messageCount}</div>
                    </div>
                )}
                <div className={styles.menu_item_inner}>
                    <GoMail size={24} />
                </div>
                <div className={`text_translate ${styles.menu_item_inner_text}`}>{t('messages')}</div>
            </div>
            <div
                className={`${styles.menu_item} ${activeTab === TabEnum.SETTINGS && styles.menu_item_active}`}
                onClick={() => onClickMenuTab(TabEnum.SETTINGS)}
            >
                <div className={styles.menu_item_inner}>
                    <IoSettingsOutline size={20} />
                </div>
                <div className={`text_translate ${styles.menu_item_inner_text}`}>{t('settings')}</div>
            </div>
        </div>
    );
});
