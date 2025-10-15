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
import { SegmentSwitcher } from '../segment-switcher';
import { OptionType } from '../segment-switcher/types.ts';

export const Memory: FC = memo(() => {
    const { t } = useTranslation();
    const { setStateApp, changeSettings } = useAppAction();

    const { cacheMemory, settings } = useAppSelector((state) => state.app);
    const cache = useFileSize(cacheMemory);

    const deleteCache = useCallback(async () => {
        await deleteAllCache();
        getCacheMemory().then((cacheMemory) => setStateApp({ cacheMemory }));
    }, []);

    const cacheOptions: OptionType[] = [
        [t('never'), 0],
        [t('1d'), 1000 * 60 * 60 * 24],
        [t('30d'), 1000 * 60 * 60 * 24 * 30],
        [t('6m'), 1000 * 60 * 60 * 24 * 30 * 6],
        [t('always'), undefined],
    ];

    return (
        <div className={styles.background}>
            <MenuTitle icon={<TbLogs />} title={'memory'} />
            <div className={styles.settings_background}>
                <div className={styles.cache}>
                    <div className={styles.cache_item}>
                        <div className={'text_translate'}>Кеширование</div>
                        <Checkbox
                            checked={!!settings.cache}
                            onChange={() => changeSettings({ ...settings, cache: !settings.cache })}
                        />
                    </div>
                    <div
                        className={styles.cache_menu}
                        style={{ filter: !settings.cache ? 'brightness(0.6)' : undefined }}
                    >
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>Фотографии</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheImageTime}
                                    onChange={(cacheImageTime) => changeSettings({ ...settings, cacheImageTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>Видео</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheVideoTime}
                                    onChange={(cacheVideoTime) => changeSettings({ ...settings, cacheVideoTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>Музыка</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheMusicTime}
                                    onChange={(cacheMusicTime) => changeSettings({ ...settings, cacheMusicTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>Файлы</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheFilesTime}
                                    onChange={(cacheFilesTime) => changeSettings({ ...settings, cacheFilesTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>Голосовые сообщения</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheVoiceTime}
                                    onChange={(cacheVoiceTime) => changeSettings({ ...settings, cacheVoiceTime })}
                                />
                            </div>
                        </div>
                    </div>
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
    );
});
