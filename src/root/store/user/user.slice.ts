import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { upsertAccountIndexDb, deleteAccountIndexDb } from './index-db/hooks.ts';
import { UserIndexDbType } from '../../types/users/user-index-db.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';

const initialState: Partial<UserIndexDbType> = {};

const UserSlice = createSlice({
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
        logout(state) {
            state.key && deleteAccountIndexDb(state.key);
            state = {};
            Envs.RSAKeys = undefined;
            localStorage.removeItem('keys');
            state.id = undefined;
            // window.location.reload();
        },
    },
});

export const UserActions = UserSlice.actions;
export const UserReducers = UserSlice.reducer;
