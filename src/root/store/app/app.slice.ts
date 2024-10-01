import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppType } from './types/app.type.ts';

const initialState: AppType = { isOpenPage: false };

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
    },
});

export const AppActions = AppSlice.actions;
export const AppReducers = AppSlice.reducer;
