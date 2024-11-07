import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatItemType } from '../../types/chat/chat-item.type.ts';

type ChatsType = {
    chats: ChatItemType[];
};

const initialState: ChatsType = {
    chats: [],
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats(state, { payload }: PayloadAction<ChatItemType[] | undefined>) {
            if (payload) state.chats = payload;
        },
        addChat(state, { payload }: PayloadAction<ChatItemType>) {
            const chats = state.chats.filter((chat) => chat.id !== payload.id);
            state.chats = [payload, ...chats];
        },
    },
});

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
