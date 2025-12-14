import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { upsertAccountIndexDb } from './index-db/hooks.ts';
import { UserIndexDbType } from '../../types/users/user-index-db.type.ts';

const initialState: Partial<UserIndexDbType> = {};

const UerSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setStateUser(state, { payload }: PayloadAction<Partial<UserIndexDbType>>) {
            for (const [key, value] of Object.entries(payload) as [
                keyof UserIndexDbType,
                UserIndexDbType[keyof UserIndexDbType],
            ][]) {
                state[key] = value as never;
            }
            upsertAccountIndexDb(state);
        },
    },
});

export const UserActions = UerSlice.actions;
export const UserReducers = UerSlice.reducer;
