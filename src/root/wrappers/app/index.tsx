import { FC } from 'react';
import styles from './index.module.css';
import Chats from '../../../modules/chats';
import { useSharedWorker } from './hooks/use-shared-worker.ts';
import { useTranslation } from './hooks/use-translation.ts';
import { useOnline } from './hooks/use-online.ts';
import { useParams } from 'react-router-dom';
import { useIndexDbHook } from './hooks/use-index-db.hook.ts';

const AppWrapper: FC<{ children: any }> = ({ children }) => {
    useSharedWorker();
    useIndexDbHook();
    useOnline();
    const isLoaded = useTranslation();
    const { id } = useParams();

    const hideMenu = () => {
        if (!id) return;
        document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
    };

    if (isLoaded)
        return (
            <div id={styles.background}>
                <div id={styles.menu}>
                    <Chats />
                </div>
                <div id={styles.chat} onClick={hideMenu}>
                    {children}
                </div>
            </div>
        );
};

export default AppWrapper;
