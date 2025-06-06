import { memo, useCallback, useState } from 'react';
import styles from './index.module.css';
import { MdDeleteOutline } from 'react-icons/md';
import { GrLanguage } from 'react-icons/gr';
import { GoMail } from 'react-icons/go';
import useSetPageHook from '../../root/store/app/hooks/use-set-page.hook.ts';
import { ChangeLanguage } from '../change-language';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../root/store';

export const Menu = memo(() => {
    const setPage = useSetPageHook();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<string>('messages');
    const messageCount = useAppSelector((state) => state.chats.messageCount);

    const deleteAllChats = useCallback(() => {
        window.indexedDB.databases().then((r) => {
            for (let i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name!);
        });
        window.location.reload();
    }, []);

    return (
        <div id={styles.menu}>
            <div
                className={`${styles.menu_item} ${activeTab === 'delete_all' && styles.menu_item_active}`}
                onClick={() => {
                    setActiveTab('delete_chats');
                    deleteAllChats();
                }}
            >
                <div className={styles.menu_item_inner}>
                    <MdDeleteOutline size={24} />
                </div>
                <div className={`text_translate ${styles.menu_item_inner_text}`}>{t('delete_chats')}</div>
            </div>
            <div
                className={`${styles.menu_item} ${activeTab === 'messages' && styles.menu_item_active}`}
                onClick={() => {
                    setActiveTab('messages');
                    setPage(null);
                }}
            >
                {messageCount && (
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
                className={`${styles.menu_item} ${activeTab === 'language' && styles.menu_item_active}`}
                onClick={() => {
                    setActiveTab('language');
                    setPage(<ChangeLanguage />);
                }}
            >
                <div className={styles.menu_item_inner}>
                    <GrLanguage size={20} />
                </div>
                <div className={`text_translate ${styles.menu_item_inner_text}`}>{t('language')}</div>
            </div>
        </div>
    );
});
