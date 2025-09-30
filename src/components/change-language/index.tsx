import { FC } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { resources } from '../../root/wrappers/app/hooks/use-translation.ts';
import { useTranslation } from 'react-i18next';
import { MenuTitle } from '../menu-title';
import { GrLanguage } from 'react-icons/gr';
import { EventsEnum } from '../../root/types/events/events.enum.ts';

export const ChangeLanguage: FC = () => {
    const { t } = useTranslation();
    const languages = Object.keys(resources);
    const { postMessageToBroadCastChannel } = useAppAction();
    const { lang } = useAppSelector((state) => state.app);

    return (
        <div id={styles.background}>
            <MenuTitle icon={<GrLanguage />} title={'language'} />
            <div id={styles.languages}>
                {languages.map((language) => (
                    <div
                        key={language}
                        className={`${styles.language_item} ${lang === language && styles.language_item_active}`}
                        onClick={() =>
                            postMessageToBroadCastChannel({ event: EventsEnum.CHANGE_LANGUAGE, data: language })
                        }
                    >
                        {t('language_native', { lng: language })}
                        <div
                            className={`${styles.language_item_round} ${lang === language && styles.language_item_round_active}`}
                        >
                            <div className={`${lang === language && styles.language_item_small_round_active}`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
