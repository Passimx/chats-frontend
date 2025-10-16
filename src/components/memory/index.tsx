import { FC, memo, useCallback, useMemo } from 'react';
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
import config from '../../../package.json';

export const Memory: FC = memo(() => {
    const { t } = useTranslation();
    const { setStateApp, changeSettings } = useAppAction();

    const { settings, cacheMemory, totalMemory, indexedDBMemory } = useAppSelector((state) => state.app);
    const cache = useFileSize(cacheMemory);

    const deleteCache = useCallback(async () => {
        await deleteAllCache();
        getCacheMemory().then((cacheMemory) => setStateApp({ cacheMemory }));
    }, []);

    const cacheOptions: OptionType[] = [
        [t('off'), 0],
        [t('1d'), 1000 * 60 * 60 * 24],
        [t('30d'), 1000 * 60 * 60 * 24 * 30],
        [t('6m'), 1000 * 60 * 60 * 24 * 30 * 6],
        [t('always'), undefined],
    ];

    const cacheItems = [
        { name: 'photos', precent: 5, size: 32143 },
        { name: 'videos', precent: 5, size: 32143 },
        { name: 'music', precent: 5, size: 32143 },
        { name: 'files', precent: 5, size: 32143 },
        { name: 'voice_messages', precent: 5, size: 32143 },
    ];

    const placePrecent = useMemo(() => {
        if (cacheMemory !== undefined && !!totalMemory && indexedDBMemory !== undefined) {
            return ((cacheMemory + indexedDBMemory) / totalMemory).toFixed(2);
        }

        return undefined;
    }, [totalMemory, cacheMemory, indexedDBMemory]);

    return (
        <div className={styles.background}>
            <MenuTitle icon={<TbLogs />} title={'memory'} />
            <div className={styles.settings_background}>
                <div className={styles.memory_usage}>
                    <div>
                        {placePrecent && (
                            <div
                                className={`${styles.memory_usage_place} text_translate`}
                            >{`${config.name} ${'занимает'} ${placePrecent}% свободного места`}</div>
                        )}
                    </div>
                    <div className={styles.cache_list}>
                        {cacheItems.map(({ name, precent, size }, index) => (
                            <div key={index} className={styles.cache_list_item}>
                                <div className={`${styles.cache_list_item_text} text_translate`}>{t(name)}</div>
                                <div className={styles.cache_list_item_precent}>{precent}%</div>
                                <div className={styles.cache_list_item_size}>{size}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.cache}>
                    <div className={styles.cache_item}>
                        <div className={'text_translate'}>Кеширование</div>
                        <Checkbox
                            checked={!!settings.cache}
                            onChange={() => changeSettings({ cache: !settings.cache })}
                        />
                    </div>
                    <div
                        className={styles.cache_menu}
                        style={{ filter: !settings.cache ? 'brightness(0.6)' : undefined }}
                    >
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('photos')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheImageTime}
                                    onChange={(cacheImageTime) => changeSettings({ cacheImageTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('videos')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheVideoTime}
                                    onChange={(cacheVideoTime) => changeSettings({ cacheVideoTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('music')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheMusicTime}
                                    onChange={(cacheMusicTime) => changeSettings({ cacheMusicTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('files')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheFilesTime}
                                    onChange={(cacheFilesTime) => changeSettings({ cacheFilesTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('voice_messages')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings.cacheVoiceTime}
                                    onChange={(cacheVoiceTime) => changeSettings({ cacheVoiceTime })}
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
