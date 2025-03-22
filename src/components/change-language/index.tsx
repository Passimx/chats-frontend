import { FC } from 'react';
import styles from './index.module.css';
import { useAppAction, useAppSelector } from '../../root/store';
import { resources } from '../../root/wrappers/app/hooks/use-translation.ts';
import { useTranslation } from 'react-i18next';

export const ChangeLanguage: FC = () => {
    const { t } = useTranslation();
    const languages = Object.keys(resources);
    const { setLang } = useAppAction();
    const { lang } = useAppSelector((state) => state.app);

    return (
        <div id={styles.background}>
            <div id={styles.text_language}>{t('language')}</div>
            <div id={styles.languages}>
                {languages.map((language) => (
                    <div
                        key={language}
                        className={`${styles.language_item} ${lang === language && styles.language_item_active}`}
                        onClick={() => setLang(language)}
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
