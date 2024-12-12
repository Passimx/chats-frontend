import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateType } from './types/state.type.ts';

const initialState: StateType = { isOpenPage: false, isOnline: navigator.onLine };

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

            if (page) document.documentElement.style.cssText = '--main-margin-left: -100%;--scale-value: 0.6;';
            else document.documentElement.style.cssText = '--main-margin-left: 0px;--scale-value: 1;';
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
    },
});

export const AppActions = AppSlice.actions;
export const AppReducers = AppSlice.reducer;
