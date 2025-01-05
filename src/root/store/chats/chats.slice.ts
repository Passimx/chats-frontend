import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatType } from '../../types/chat/chat.type.ts';
import { StateType } from './types/state.type.ts';
import rawChats from './chats.raw.ts';
import { UpdateReadChatType } from './types/update-read-chat.type.ts';
import { deleteChatIndexDb, updateChatAtIndexDb, updateReadChat } from './index-db/hooks.ts';

const initialState: StateType = {
    chats: [],
    updatedChats: [],
    chatsRead: [],
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        update(state, { payload }: PayloadAction<ChatType>) {
            rawChats.chats.set(payload.id, payload);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
            updateChatAtIndexDb(payload);
        },

        setToBegin(state, { payload }: PayloadAction<ChatType>) {
            rawChats.chats.delete(payload.id);
            rawChats.chats.set(payload.id, payload);
            state.chats = Array.from(rawChats.chats.values()).reverse();
            updateChatAtIndexDb(payload);
        },

        updateReadChat(state, { payload }: PayloadAction<UpdateReadChatType>) {
            const { chatId, number } = payload;
            updateReadChat(chatId, number);
            state.chatsRead.push({ chatId, number });
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

        setToEnd(state, { payload }: PayloadAction<ChatType[] | undefined>) {
            if (!payload) return;
            const newMap = new Map<string, ChatType>();

            [...payload].reverse().forEach((chat) => newMap.set(chat.id, chat));

            rawChats.chats = new Map<string, ChatType>([...newMap, ...rawChats.chats]);

            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        setChatOnPage(state, { payload }: PayloadAction<ChatType | null>) {
            state.chatOnPage = payload ?? undefined;
        },

        removeChat(state, { payload }: PayloadAction<string>) {
            const chat = rawChats.chats.get(payload);
            if (!chat) return;
            deleteChatIndexDb(payload);

            rawChats.chats.delete(payload);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },
    },
});

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
