import { FC, memo, useCallback } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { TbLogs } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { AiOutlineClear } from 'react-icons/ai';
import { Checkbox } from '../checkbox';
import { useFileSize } from '../../common/hooks/use-file-size.ts';
import { useAppAction, useAppSelector } from '../../root/store';
import { getCacheMemory } from '../../common/cache/get-cache-memory.ts';
import { deleteAllCache } from '../../common/cache/delete-chat-cache.ts';

export const Memory: FC = memo(() => {
    const { t } = useTranslation();
    const { setStateApp } = useAppAction();

    const { cacheMemory } = useAppSelector((state) => state.app);
    const cache = useFileSize(cacheMemory);

    const deleteCache = useCallback(async () => {
        await deleteAllCache();
        getCacheMemory().then((cacheMemory) => setStateApp({ cacheMemory }));
    }, []);

    return (
        <div className={styles.background}>
            <MenuTitle icon={<TbLogs />} title={'memory'} />
            <div className={styles.settings_background}>
                <div>
                    <div>
                        <div>Автозагрузка файлов</div>
                        <Checkbox checked={true} onChange={() => {}} />
                    </div>
                </div>
                <div className={styles.button_background} onClick={deleteCache}>
                    <div className={styles.button}>
                        <div className={styles.button_text}>
                            <AiOutlineClear size={24} />
                            <div className={'text_translate'}>
                                {t('clear_cache')}&nbsp;<span className={styles.button_text_span}>{cache}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
