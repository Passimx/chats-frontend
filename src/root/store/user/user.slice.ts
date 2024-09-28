import { createSlice } from '@reduxjs/toolkit';
import { UserType } from './types/user.type.ts';

const initialState: Partial<UserType> = {};

const UerSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
});

export const UserActions = UerSlice.actions;
export const UserReducers = UerSlice.reducer;
