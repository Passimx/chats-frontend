import { useEffect, useState } from 'react';
import moment from 'moment/min/moment-with-locales';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AR from './languages/ar/translation.json';
import CH from './languages/zh/translation.json';
import EN from './languages/en/translation.json';
import ES from './languages/es/translation.json';
import RU from './languages/ru/translation.json';
import { useAppSelector } from '../../../../store';

export const resources = {
    ar: {
        translation: AR,
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
    zh: {
        translation: CH,
    },
};

export const useTranslation = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { settings } = useAppSelector((state) => state.app);

    useEffect(() => {
        if (!settings) return;
        const elements = document.querySelectorAll<HTMLDivElement>('.text_translate');
        elements.forEach((el) => {
            el.style.animation = 'none';
            el.style.filter = 'blur(4px)';
        });

        moment.locale(settings.lang);
        i18n.use(initReactI18next)
            .init({
                resources,
                lng: settings.lang,
                fallbackLng: settings.lang,
                interpolation: {
                    escapeValue: false,
                },
            })
            .then(() => {
                setIsLoaded(true);
                elements.forEach((el) => {
                    const time = 200;
                    el.style.animation = `show ${time}ms ease forwards`;

                    setTimeout(() => {
                        el.style.filter = 'none';
                        el.style.animation = 'none';
                    }, time);
                });
            });
    }, [settings?.lang]);

    return isLoaded;
};
