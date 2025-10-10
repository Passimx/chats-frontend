import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsType, StateType, TabEnum } from './types/state.type.ts';
import { LocalEvents } from '../../types/events/local-events.type.ts';
import { JSX } from 'react';
import { Envs } from '../../../common/config/envs/envs.ts';

const channel = new BroadcastChannel('ws-channel');

const initialState: StateType = {
    isOpenPage: false,
    activeTab: TabEnum.CHATS,
    isOnline: navigator.onLine,
    pages: new Map<TabEnum, JSX.Element[]>(),
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    settings: {
        messagesLimit: 250,
    },
};

const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setPage(
            state,
            { payload: { page, isOpenPage } }: PayloadAction<{ page?: JSX.Element | null; isOpenPage?: boolean }>,
        ) {
            state.isOpenPage = isOpenPage !== undefined ? isOpenPage : !!page;
            if (page !== undefined) state.page = page ?? undefined;

            if (page) {
                document.documentElement.style.setProperty('--main-margin-left', '-100%');
                document.documentElement.style.setProperty('--scale-value', '0.6');
            } else {
                document.documentElement.style.setProperty('--main-margin-left', '0px');
                document.documentElement.style.setProperty('--scale-value', '1');
            }
        },

        postMessageToBroadCastChannel(_state, { payload }: PayloadAction<LocalEvents>) {
            channel.postMessage(payload);
        },

        setStateApp(state, { payload }: PayloadAction<Partial<StateType>>) {
            for (const [key, value] of Object.entries(payload) as [keyof StateType, StateType[keyof StateType]][]) {
                state[key] = value as never;
            }
        },

        setLang(state, { payload }: PayloadAction<string>) {
            state.settings.lang = payload;
            localStorage.setItem('settings', JSON.stringify(state.settings));
        },

        addLog(state, { payload }: PayloadAction<string>) {
            state.logs = [...(state.logs ?? []), payload];
        },

        changeSettings(state, { payload }: PayloadAction<SettingsType>) {
            localStorage.setItem('settings', JSON.stringify(payload));
            Envs.settings = payload;
            state.settings = payload;
        },
    },
});

export const AppActions = AppSlice.actions;
export const AppReducers = AppSlice.reducer;
