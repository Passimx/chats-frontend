import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatItemType } from '../../types/chat/chat-item.type.ts';

type InitType = {
    chats: ChatItemType[];
};

const initialState: InitType = {
    chats: [],
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats(state, { payload }: PayloadAction<ChatItemType[] | undefined>) {
            if (payload) state.chats = payload;
        },
    },
});

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
