import { FC } from 'react';
import styles from './index.module.css';
import Chats from '../../../modules/chats';
import { useSharedWorker } from './hooks/use-shared-worker.ts';
import { useTranslation } from './hooks/use-translation.ts';

const AppWrapper: FC<{ children: any }> = ({ children }) => {
    useSharedWorker();
    const isLoaded = useTranslation();

    const hideMenu = () => document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');

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
