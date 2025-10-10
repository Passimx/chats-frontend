import { useEffect } from 'react';
import { SettingsType } from '../../../store/app/types/state.type.ts';
import { useAppAction } from '../../../store';
import { Envs } from '../../../../common/config/envs/envs.ts';

export const useSettings = () => {
    const { setStateApp } = useAppAction();

    useEffect(() => {
        const payload = localStorage.getItem('settings');
        if (!payload) return;

        const settings: SettingsType = JSON.parse(payload);
        Envs.settings = settings;
        setStateApp({ settings });
    }, []);
};
