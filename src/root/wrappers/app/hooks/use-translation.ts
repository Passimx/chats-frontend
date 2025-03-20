import { useEffect, useState } from 'react';
import moment from 'moment/min/moment-with-locales';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AR from '../../../../../public/languages/ar/translation.json';
import CH from '../../../../../public/languages/ch/translation.json';
import EN from '../../../../../public/languages/en/translation.json';
import ES from '../../../../../public/languages/es/translation.json';
import RU from '../../../../../public/languages/ru/translation.json';
import { useAppSelector } from '../../../store';

const resources = {
    ar: {
        translation: AR,
    },
    ch: {
        translation: CH,
    },
    en: {
        translation: EN,
    },
    es: {
        translation: ES,
    },
    ru: {
        translation: RU,
    },
};

export const useTranslation = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { lang } = useAppSelector((state) => state.app);

    useEffect(() => {
        moment.locale(lang);
        i18n.use(initReactI18next)
            .init({
                resources,
                lng: lang,
                fallbackLng: lang,
                interpolation: {
                    escapeValue: false,
                },
            })
            .then(() => setIsLoaded(true));
    }, [lang]);

    return isLoaded;
};
