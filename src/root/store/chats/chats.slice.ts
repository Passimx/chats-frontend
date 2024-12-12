import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatType } from '../../types/chat/chat.type.ts';
import { StateType } from './types/state.type.ts';
import rawChats from './chats.raw.ts';

const initialState: StateType = {
    chats: [],
    updatedChats: [],
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        update(state, { payload }: PayloadAction<ChatType>) {
            rawChats.chats.set(payload.id, payload);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        setToBegin(state, { payload }: PayloadAction<ChatType>) {
            rawChats.chats.delete(payload.id);
            rawChats.chats.set(payload.id, payload);
            state.chats = Array.from(rawChats.chats.values()).reverse();
        },

        addUpdatedChat(state, { payload }: PayloadAction<ChatType>) {
            rawChats.updatedChats.delete(payload.id);
            rawChats.updatedChats.set(payload.id, payload);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
        },

        removeUpdatedChats(state, { payload }: PayloadAction<ChatType>) {
            rawChats.updatedChats.delete(payload.id);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
        },
        // setToEnd(state, { payload }: PayloadAction<ChatType[] | undefined>) {
        //     if (!payload) return;
        //     const newMap = new Map<number, ChatType>();
        //
        //     [...payload].reverse().forEach((chat) => newMap.set(chat.id, chat));
        //
        //     rawChats.chats = new Map<number, ChatType>([...newMap, ...rawChats.chats]);
        //
        //     state.chats = [...Array.from(rawChats.chats.values())].reverse();
        // },
        // removeAll(state) {
        //     rawChats.chats = new Map<number, ChatType>();
        //     state.chats = [];
        // },
    },
});

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
