import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { upsertAccountIndexDb, deleteAccountIndexDb } from './index-db/hooks.ts';
import { UserIndexDbType } from '../../types/users/user-index-db.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { deleteAllChatsIndexDb } from '../chats/index-db/hooks.ts';

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
            deleteAllChatsIndexDb();
            Envs.RSAKeys = undefined;
            localStorage.removeItem('keys');
            return {};
        },
    },
});

export const UserActions = UserSlice.actions;
export const UserReducers = UserSlice.reducer;
