import { FC, memo } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { MenuTitle } from '../menu-title';
import { TbLogs } from 'react-icons/tb';
import { AiOutlineClear } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { ColorLog } from '../color-log/color-log.index.tsx';

export const LogList: FC = memo(() => {
    const { t } = useTranslation();
    const { logs } = useAppSelector((state) => state.app);
    const { setStateApp } = useAppAction();

    return (
        <div className={styles.background}>
            <MenuTitle icon={<TbLogs />} title={'logs'} />
            <div className={styles.log_list}>
                {logs?.map((log, key) => (
                    <div key={key} className={styles.log_item}>
                        <ColorLog text={log} />
                    </div>
                ))}
            </div>
            <div></div>
            <div className={styles.background_clear}>
                <div className={styles.background_button} onClick={() => setStateApp({ logs: undefined })}>
                    <div className={styles.button}>
                        <AiOutlineClear size={18} />
                        <div className={'text_translate'}>
                            {t('clear')}&nbsp;<span className={styles.button_text_span}>{logs?.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
