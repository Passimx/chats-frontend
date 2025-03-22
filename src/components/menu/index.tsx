import { memo, useCallback } from 'react';
import styles from './index.module.css';
import { MdDeleteOutline } from 'react-icons/md';
import { GrLanguage } from 'react-icons/gr';
import { GoMail } from 'react-icons/go';
import useSetPageHook from '../../root/store/app/hooks/use-set-page.hook.ts';
import { ChangeLanguage } from '../change-language';

export const Menu = memo(() => {
    const setPage = useSetPageHook();

    const deleteAllChats = useCallback(() => {
        window.indexedDB.databases().then((r) => {
            for (let i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name!);
        });
        window.location.reload();
    }, []);

    return (
        <div id={styles.delete_chats}>
            <div className={styles.menu_item} onClick={deleteAllChats}>
                <MdDeleteOutline size={30} />
            </div>
            <div
                className={styles.menu_item}
                onClick={() => {
                    setPage(null);
                }}
            >
                <GoMail size={30} />
            </div>
            <div className={styles.menu_item} onClick={() => setPage(<ChangeLanguage />)}>
                <GrLanguage size={24} />
            </div>
        </div>
    );
});
