import { useEffect, useState } from 'react';
import moment from 'moment/min/moment-with-locales';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AR from '../../../../../public/languages/ar/translation.json';
import CH from '../../../../../public/languages/ch/translation.json';
import EN from '../../../../../public/languages/en/translation.json';
import ES from '../../../../../public/languages/es/translation.json';
import RU from '../../../../../public/languages/ru/translation.json';
import { useAppAction, useAppSelector } from '../../../store';

export const resources = {
    en: {
        translation: EN,
    },
    zh_cn: {
        translation: CH,
    },
    es: {
        translation: ES,
    },
    ar: {
        translation: AR,
    },
    ru: {
        translation: RU,
    },
};

export const useTranslation = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { setLang } = useAppAction();
    const { lang } = useAppSelector((state) => state.app);

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLDivElement>('.text_translate');
        elements.forEach((el) => {
            el.style.animation = 'none';
            el.style.filter = 'blur(4px)';
        });

        if (!lang) {
            const browserLang = navigator.language.slice(0, 2).toLowerCase();
            const langs = Object.keys(resources);
            const lang = localStorage.getItem('lang') ?? langs.find((lang) => lang === browserLang) ?? 'en';
            if (!localStorage.getItem('lang')) localStorage.setItem('lang', lang);
            setLang(lang);

            return;
        }

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
    }, [lang]);

    return isLoaded;
};
