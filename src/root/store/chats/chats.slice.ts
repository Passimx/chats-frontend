import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatItemIndexDb, ChatType } from '../../types/chat/chat.type.ts';
import { StateType } from './types/state.type.ts';
import rawChats, { deleteChat, getRawChat, updateRawChat } from './chats.raw.ts';
import { deleteChatIndexDb, updateChatIndexDb, upsertChatIndexDb } from './index-db/hooks.ts';
import { MessageType } from '../../types/chat/message.type.ts';
import { UpdateChat } from './types/update-chat.type.ts';

const initialState: StateType = {
    chats: [],
    updatedChats: [],
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        update(state, { payload }: PayloadAction<UpdateChat>) {
            const chat = getRawChat(payload.id);
            if (!chat) return;
            const updatedChat = { ...chat, ...payload };
            if (chat.id === state.chatOnPage?.id) state.chatOnPage = updatedChat;
            updateChatIndexDb(updatedChat);
            updateRawChat(updatedChat);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        updateMany(state, { payload: data }: PayloadAction<UpdateChat[]>) {
            data.forEach((payload) => {
                const chat = getRawChat(payload.id);
                if (!chat) return;
                const updatedChat = { ...chat, ...payload };
                if (chat.id === state.chatOnPage?.id) state.chatOnPage = updatedChat;
                updateChatIndexDb(updatedChat);
                updateRawChat(updatedChat);
            });
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        addUpdatedChat(state, { payload }: PayloadAction<ChatItemIndexDb>) {
            upsertChatIndexDb(payload);
            rawChats.updatedChats.delete(payload.id);
            rawChats.updatedChats.set(payload.id, payload);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
        },

        createMessage(state, { payload }: PayloadAction<MessageType>) {
            const chatFromState = getRawChat(payload.chatId);
            if (chatFromState) {
                let messages = chatFromState.messages;
                if (chatFromState?.messages[0]?.number === payload.number - 1) messages = [payload, ...messages];

                const updatedChat: ChatItemIndexDb = {
                    ...chatFromState,
                    message: payload,
                    countMessages: payload.number,
                    messages,
                };
                updateRawChat(updatedChat);
                state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
                state.chats = [...Array.from(rawChats.chats.values())].reverse();
            }

            if (payload.chatId === state.chatOnPage?.id) state.chatOnPage.message = payload;
        },

        setToBegin(state, { payload }: PayloadAction<ChatItemIndexDb>) {
            rawChats.chats.delete(payload.id);
            rawChats.chats.set(payload.id, payload);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        removeUpdatedChats(state, { payload }: PayloadAction<ChatType>) {
            rawChats.updatedChats.delete(payload.id);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
        },

        setToEnd(state, { payload }: PayloadAction<ChatItemIndexDb[] | undefined>) {
            if (!payload?.length) return;

            const newMap = new Map<string, ChatItemIndexDb>();

            [...payload].reverse().forEach((chat) => newMap.set(chat.id, chat));

            rawChats.chats = new Map<string, ChatItemIndexDb>([...newMap, ...rawChats.chats]);

            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        setChatOnPage(state, { payload }: PayloadAction<ChatType | null>) {
            state.chatOnPage = payload ?? undefined;
        },

        removeChat(state, { payload }: PayloadAction<string>) {
            const chat = getRawChat(payload);
            if (!chat) return;
            deleteChatIndexDb(payload);

            deleteChat(payload);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
        },
    },
});

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
