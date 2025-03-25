import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateType } from './types/state.type.ts';
import { resources } from '../../wrappers/app/hooks/use-translation.ts';

const browserLang = navigator.language.slice(0, 2).toLowerCase();
const langs = Object.keys(resources);
const lang = localStorage.getItem('lang') ?? langs.find((lang) => lang === browserLang) ?? 'en';

const initialState: StateType = {
    lang,
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

        setOnline(state, { payload }: PayloadAction<boolean>) {
            state.isOnline = payload;
        },

        setSocketId(state, { payload }: PayloadAction<string | undefined>) {
            state.socketId = payload;
        },

        setIsListening(state, { payload }: PayloadAction<boolean>) {
            state.isListening = payload;
        },

        setIsLoadedChatsFromIndexDb(state, { payload }: PayloadAction<boolean>) {
            state.isLoadedChatsFromIndexDb = payload;
        },

        setIsPhone(state) {
            const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
            state.isPhone = toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
        },

        setIsSystemChat(state, { payload }: PayloadAction<boolean>) {
            state.isSystemChat = payload;
        },

        setLang(state, { payload }: PayloadAction<string>) {
            state.lang = payload;
            localStorage.setItem('lang', payload);
        },
    },
});

export const AppActions = AppSlice.actions;
export const AppReducers = AppSlice.reducer;
