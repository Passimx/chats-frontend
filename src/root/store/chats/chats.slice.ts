import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatType } from '../../types/chat/chat.type.ts';
import { StateType } from './types/state.type.ts';
import rawChats from './chats.raw.ts';
import { UpdateReadChatType } from './types/update-read-chat.type.ts';

const initialState: StateType = {
    chats: [],
    updatedChats: [],
};

const updateChatAtIndexDb = (payload: ChatType) => {
    const IndexDb = rawChats.indexDb;

    if (!IndexDb) return;
    const dateNow = Date.now();
    const chatsKeys = IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys');

    const request = chatsKeys.get(payload.id);

    request.onsuccess = () => {
        if (!IndexDb) return;

        if (request.result) IndexDb.transaction('chats', 'readwrite').objectStore('chats').delete(request.result);

        IndexDb.transaction('chats', 'readwrite').objectStore('chats').add(payload, dateNow);
        IndexDb.transaction('chats-keys', 'readwrite').objectStore('chats-keys').delete(payload.id).onsuccess = () =>
            IndexDb?.transaction('chats-keys', 'readwrite').objectStore('chats-keys').add(dateNow, payload.id);
    };
};

const updateReadChat = (chatId: number, number: number) => {
    const IndexDb = rawChats.indexDb;
    rawChats.chatsRead.set(chatId, number);
    if (!IndexDb) return;

    IndexDb.transaction('chats-read', 'readwrite').objectStore('chats-read').delete(chatId);
    IndexDb.transaction('chats-read', 'readwrite').objectStore('chats-read').add(number, chatId);
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
            if (!state.chatsRead) state.chatsRead = [];
            if (!payload) return;
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
            const newMap = new Map<number, ChatType>();

            [...payload].reverse().forEach((chat) => newMap.set(chat.id, chat));

            rawChats.chats = new Map<number, ChatType>([...newMap, ...rawChats.chats]);

            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },
        // removeAll(state) {
        //     rawChats.chats = new Map<number, ChatType>();
        //     state.chats = [];
        // },
    },
});

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
