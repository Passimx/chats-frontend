import { useEffect, useState } from 'react';
import moment from 'moment/min/moment-with-locales';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../../../../../public/languages/en/translation.json';
import translationRU from '../../../../../public/languages/ru/translation.json';

const resources = {
    en: {
        translation: translationEN,
    },
    ru: {
        translation: translationRU,
    },
};

export const useTranslation = () => {
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

    return isLoaded;
};
