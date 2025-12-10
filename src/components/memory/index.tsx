import { FC, memo, useCallback, useMemo } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { TbLogs } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { AiOutlineClear } from 'react-icons/ai';
import { Checkbox } from '../checkbox';
import { getFileSize } from '../../common/hooks/get-file-size.ts';
import { useAppAction, useAppSelector } from '../../root/store';
import { getCacheMemory } from '../../common/cache/get-cache-memory.ts';
import { deleteAllCache } from '../../common/cache/delete-chat-cache.ts';
import { SegmentSwitcher } from '../segment-switcher';
import { OptionType } from '../segment-switcher/types.ts';
import config from '../../../package.json';

export const Memory: FC = memo(() => {
    const { t } = useTranslation();
    const { setStateApp, changeSettings } = useAppAction();

    const { settings, cacheMemory, totalMemory, indexedDBMemory, categories } = useAppSelector((state) => state.app);

    const cache = useMemo(() => {
        const [memory, unit] = getFileSize(cacheMemory);
        return `${memory} ${t(unit)}`;
    }, [cacheMemory]);

    const deleteCache = useCallback(async () => {
        await deleteAllCache();
        setStateApp(await getCacheMemory());
    }, []);

    const [cacheOptions, autoUploadOptions, cacheLimitOptions]: OptionType[][] = useMemo(() => {
        return [
            [
                [t('off'), 0],
                [t('1d'), 1000 * 60 * 60 * 24],
                [t('30d'), 1000 * 60 * 60 * 24 * 30],
                [t('6m'), 1000 * 60 * 60 * 24 * 30 * 6],
                [t('always'), undefined],
            ],
            [
                [t('off'), 0],
                [`8 ${t('mb')}`, 1024 * 1024 * 8],
                [`16 ${t('mb')}`, 1024 * 1024 * 16],
                [t('always'), undefined],
            ],
            [
                [`1 ${t('gb')}`, 1024 * 1024 * 1024],
                [`8 ${t('gb')}`, 1024 * 1024 * 1024 * 8],
                [`32 ${t('gb')}`, 1024 * 1024 * 1024 * 32],
                [t('off'), undefined],
            ],
        ];
    }, []);

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
                            >{`${config.name} ${t('phrase_1')} ${placePrecent}% ${t('phrase_2')}`}</div>
                        )}
                    </div>
                    <div className={styles.cache_list}>
                        {categories &&
                            Object.entries(categories)
                                .sort(([, a], [, b]) => b.absoluteMemory - a.absoluteMemory) // сортируем по убыванию
                                .map(([key, category]) => (
                                    <div key={key} className={styles.cache_list_item}>
                                        <div className={`${styles.cache_list_item_text} text_translate`}>{t(key)}</div>
                                        <div className={styles.cache_list_item_precent}>
                                            {cacheMemory === 0
                                                ? 0
                                                : ((category.absoluteMemory * 100) / (cacheMemory ?? 1)).toFixed(2)}
                                            %
                                        </div>
                                        <div className={styles.cache_list_item_size}>
                                            {category.unit.memory} {t(category.unit.unit)}
                                        </div>
                                    </div>
                                ))}
                    </div>
                </div>
                <div className={styles.tab}>
                    <div className={styles.cache_item}>
                        <div className={styles.cache_item_switcher}>
                            <div className={'text_translate'}>{t('max_cache_size')}</div>
                        </div>
                        <div className={`${styles.cache_item_description} text_translate`}>
                            {t('cache_limit_warning')}
                        </div>
                    </div>
                    <div className={styles.cache_menu}>
                        <div className={styles.cache_menu_item}>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheLimitOptions}
                                    value={settings?.cacheTotalMemory}
                                    onChange={(cacheTotalMemory) => changeSettings({ cacheTotalMemory })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.tab}>
                    <div className={styles.cache_item}>
                        <div className={styles.cache_item_switcher}>
                            <div className={'text_translate'}>{t('caching')}</div>
                            <Checkbox
                                checked={!!settings?.cache}
                                onChange={() => changeSettings({ cache: !settings?.cache })}
                            />
                        </div>
                        <div className={`${styles.cache_item_description} text_translate`}>{t('cache_duration')}</div>
                    </div>
                    <div
                        className={styles.cache_menu}
                        style={{ filter: !settings?.cache ? 'brightness(0.6)' : undefined }}
                    >
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('photos')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings?.cacheImageTime}
                                    onChange={(cacheImageTime) => changeSettings({ cacheImageTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('videos')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings?.cacheVideoTime}
                                    onChange={(cacheVideoTime) => changeSettings({ cacheVideoTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('music')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings?.cacheMusicTime}
                                    onChange={(cacheMusicTime) => changeSettings({ cacheMusicTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('files')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings?.cacheFilesTime}
                                    onChange={(cacheFilesTime) => changeSettings({ cacheFilesTime })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('voice_messages')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={cacheOptions}
                                    value={settings?.cacheVoiceTime}
                                    onChange={(cacheVoiceTime) => changeSettings({ cacheVoiceTime })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.tab}>
                    <div className={styles.cache_item}>
                        <div className={styles.cache_item_switcher}>
                            <div className={'text_translate'}>{t('auto_download')}</div>
                            <Checkbox
                                checked={!!settings?.autoUpload}
                                onChange={() => changeSettings({ autoUpload: !settings?.autoUpload })}
                            />
                        </div>
                        <div className={`${styles.cache_item_description} text_translate`}>
                            {t('max_autodownload_size')}
                        </div>
                    </div>
                    <div
                        className={styles.cache_menu}
                        style={{ filter: !settings?.autoUpload ? 'brightness(0.6)' : undefined }}
                    >
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('photos')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={autoUploadOptions}
                                    value={settings?.autoUploadImage}
                                    onChange={(autoUploadImage) => changeSettings({ autoUploadImage })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('videos')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={autoUploadOptions}
                                    value={settings?.autoUploadVideo}
                                    onChange={(autoUploadVideo) => changeSettings({ autoUploadVideo })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('music')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={autoUploadOptions}
                                    value={settings?.autoUploadMusic}
                                    onChange={(autoUploadMusic) => changeSettings({ autoUploadMusic })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('files')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={autoUploadOptions}
                                    value={settings?.autoUploadFiles}
                                    onChange={(autoUploadFiles) => changeSettings({ autoUploadFiles })}
                                />
                            </div>
                        </div>
                        <div className={styles.cache_menu_item}>
                            <div className={`${styles.cache_menu_item_text} text_translate`}>{t('voice_messages')}</div>
                            <div className={styles.cache_menu_item_select}>
                                <SegmentSwitcher
                                    options={autoUploadOptions}
                                    value={settings?.autoUploadVoice}
                                    onChange={(autoUploadVoice) => changeSettings({ autoUploadVoice })}
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
