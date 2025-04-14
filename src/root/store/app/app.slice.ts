import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateType } from './types/state.type.ts';
import { LocalEvents } from '../../types/events/local-events.type.ts';

const channel = new BroadcastChannel('ws-channel');

const initialState: StateType = {
    isOpenPage: false,
    isOnline: navigator.onLine,
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

        setIsPhone(state) {
            const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
            state.isPhone = toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
        },

        setStateApp(state, { payload }: PayloadAction<Partial<StateType>>) {
            for (const [key, value] of Object.entries(payload) as [keyof StateType, StateType[keyof StateType]][]) {
                state[key] = value as never;
            }
        },

        setLang(state, { payload }: PayloadAction<string>) {
            state.lang = payload;
            localStorage.setItem('lang', payload);
        },
    },
});

export const AppActions = AppSlice.actions;
export const AppReducers = AppSlice.reducer;
