import { useEffect, useState } from 'react';
import moment from 'moment/min/moment-with-locales';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AR from '../../../../../public/languages/ar/translation.json';
import CH from '../../../../../public/languages/zh/translation.json';
import EN from '../../../../../public/languages/en/translation.json';
import ES from '../../../../../public/languages/es/translation.json';
import RU from '../../../../../public/languages/ru/translation.json';
import { useAppAction, useAppSelector } from '../../../store';

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
    const { setLang } = useAppAction();
    const { settings } = useAppSelector((state) => state.app);

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLDivElement>('.text_translate');
        elements.forEach((el) => {
            el.style.animation = 'none';
            el.style.filter = 'blur(4px)';
        });

        if (!settings.lang) {
            const browserLang = navigator.language.slice(0, 2).toLowerCase();
            const langs = Object.keys(resources);
            const lang = langs.find((lang) => lang === browserLang) ?? 'en';
            setLang(lang);

            return;
        }

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
    }, [settings.lang]);

    return isLoaded;
};
