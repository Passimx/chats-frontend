import { FC, useEffect, useState } from 'react';
import styles from './index.module.css';
import translationEN from '../../../../languages/en/translation.json';
import translationRU from '../../../../languages/ru/translation.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';
import Chats from '../../../modules/chats';

const resources = {
    en: {
        translation: translationEN,
    },
    ru: {
        translation: translationRU,
    },
};

const AppWrapper: FC<{ children: any }> = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const lang = navigator.language ?? 'en';

        i18n.use(initReactI18next).init({
            resources,
            lng: lang,
            fallbackLng: lang,
            interpolation: {
                escapeValue: false,
            },
        });
        moment.locale(lang);
        setIsLoaded(true);
    }, []);

    if (isLoaded)
        return (
            <div id={styles.background}>
                <div id={styles.menu}>
                    <Chats />
                </div>
                <div id={styles.chat}>{children}</div>
            </div>
        );
};

export default AppWrapper;
