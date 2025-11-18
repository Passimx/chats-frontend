import { FC, memo, useCallback, useMemo } from 'react';
import { MenuTitle } from '../menu-title';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { useAppAction, useAppSelector } from '../../root/store';
import { getRawChats, getRawChatsLength } from '../../root/store/raw/chats.raw.ts';
import { EventsEnum } from '../../root/types/events/events.enum.ts';
import { SegmentSwitcher } from '../segment-switcher';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';

export const Chats: FC = memo(() => {
    const { t } = useTranslation();
    const { postMessageToBroadCastChannel, changeSettings } = useAppAction();
    const { chats, updatedChats } = useAppSelector((state) => state.chats);
    const navigate = useCustomNavigate();

    const deleteChats = useCallback(() => {
        const chats = getRawChats();
        chats.forEach((chat) => {
            postMessageToBroadCastChannel({ event: EventsEnum.REMOVE_CHAT, data: chat.id });
            navigate('/');
        });
    }, []);

    const chatsLength = useMemo(() => {
        return getRawChatsLength();
    }, [updatedChats.length + chats.length]);

    const { settings } = useAppSelector((state) => state.app);

    const changeMessageLimit = useCallback((value?: number) => {
        if (value) changeSettings({ messagesLimit: value });
    }, []);

    const changeMessageSaveCount = useCallback((value?: number) => {
        changeSettings({ messageSaveCount: value });
    }, []);

    const changeMessageSaveTime = useCallback((value?: number) => {
        changeSettings({ messageSaveTime: value });
    }, []);

    return (
        <div className={styles.background}>
            <MenuTitle icon={<IoChatboxEllipsesOutline />} title={'chats'} />
            <div className={styles.settings_background}>
                <div className={styles.main}>
                    <div className={styles.count}>
                        <div className={`${styles.count_text} text_translate`}>{t('messages_limit')}</div>
                        <div className={styles.count_background}>
                            <SegmentSwitcher
                                options={[
                                    [250, 250],
                                    [500, 500],
                                    [750, 750],
                                    [1000, 1000],
                                ]}
                                value={settings?.messagesLimit}
                                onChange={changeMessageLimit}
                            />
                        </div>
                    </div>
                    <div className={styles.count}>
                        <div className={`${styles.count_text} text_translate`}>{t('message_save_count')}</div>
                        <div className={styles.count_background}>
                            <SegmentSwitcher
                                options={[
                                    [`1${t('k')}`, 1000],
                                    [`3${t('k')}`, 3000],
                                    [`5${t('k')}`, 5000],
                                    [`10${t('k')}`, 10000],
                                    [t('all'), undefined],
                                ]}
                                value={settings?.messageSaveCount}
                                onChange={changeMessageSaveCount}
                            />
                        </div>
                    </div>
                    <div className={styles.count}>
                        <div className={`${styles.count_text} text_translate`}>{t('message_save_time')}</div>
                        <div className={styles.count_background}>
                            <SegmentSwitcher
                                options={[
                                    [t('1d'), 1000 * 60 * 60 * 24],
                                    [t('30d'), 1000 * 60 * 60 * 24 * 30],
                                    [t('6m'), 1000 * 60 * 60 * 24 * 30 * 6],
                                    [t('1y'), 1000 * 60 * 60 * 24 * 30 * 6 * 2],
                                    [t('always'), undefined],
                                ]}
                                value={settings?.messageSaveTime}
                                onChange={changeMessageSaveTime}
                            />
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className={styles.button_background} onClick={deleteChats}>
                    <div className={styles.button}>
                        <div className={styles.button_text}>
                            <MdOutlineDeleteSweep size={24} />
                            <div className={'text_translate'}>
                                {t('delete_chats')}&nbsp;
                                <span className={styles.button_text_span}>{chatsLength}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
