import { useEffect } from 'react';
import { SettingsType } from '../../../store/app/types/state.type.ts';
import { useAppAction } from '../../../store';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { resources } from './use-translation.ts';

export const useSettings = () => {
    const { changeSettings } = useAppAction();

    useEffect(() => {
        const initSettings: SettingsType = {
            cache: true,
            autoUpload: true,
            messagesLimit: 250,
        };

        const payload = localStorage.getItem('settings');
        const settings: SettingsType = payload ? JSON.parse(payload) : {};

        if (!settings.lang) {
            const browserLang = navigator.language.slice(0, 2).toLowerCase();
            const languages: string[] = Object.keys(resources);
            settings.lang = languages.find((lang) => lang === browserLang) ?? 'en';
        }

        Envs.settings = settings;
        changeSettings({ ...initSettings, ...settings });
    }, []);
};
