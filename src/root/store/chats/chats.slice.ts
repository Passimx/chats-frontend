import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatType } from '../../types/chat/chat.type.ts';

type ChatsType = {
    chats: ChatType[];
};

const initialState: ChatsType = {
    chats: [],
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats(state, { payload }: PayloadAction<ChatType[] | undefined>) {
            if (payload) state.chats = payload;
        },
        addChat(state, { payload }: PayloadAction<ChatType>) {
            const chats = state.chats.filter((chat) => chat.id !== payload.id);
            state.chats = [payload, ...chats];
        },
    },
});

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
