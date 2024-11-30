import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatType } from '../../types/chat/chat.type.ts';
import { StateType } from './types/state.type.ts';

const chatsMap: Map<number, ChatType> = new Map<number, ChatType>();

const initialState: StateType = {
    chats: [],
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats(state, { payload }: PayloadAction<ChatType[] | undefined>) {
            if (!payload) return;

            payload.forEach((chat) => chatsMap.set(chat.id, chat));

            state.chats = Array.from(chatsMap.values());
        },
        addChat(state, { payload }: PayloadAction<ChatType>) {
            chatsMap.delete(payload.id);
            chatsMap.set(payload.id, payload);
            state.chats = Array.from(chatsMap.values()).reverse();
        },
    },
});

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
