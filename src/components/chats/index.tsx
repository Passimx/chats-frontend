import { FC, memo } from 'react';
import { MenuTitle } from '../menu-title';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import styles from './index.module.css';

export const Chats: FC = memo(() => {
    // const deleteAllChats = useCallback(() => {
    //     window.indexedDB.databases().then((r) => {
    //         for (let i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name!);
    //     });
    //     window.location.reload();
    //     // todo
    //     // добавить удаление кеша
    // }, []);

    return (
        <div className={styles.background}>
            <MenuTitle icon={<IoChatboxEllipsesOutline />} title={'chats'} />
            <div></div>
        </div>
    );
});
