import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatItemIndexDb, ChatType } from '../../types/chat/chat.type.ts';
import { StateType } from './types/state.type.ts';
import rawChats, { deleteChat, getRawChat, updateRawChat } from '../raw/chats.raw.ts';
import { deleteChatIndexDb, updateChatIndexDb, upsertChatIndexDb } from './index-db/hooks.ts';
import { MessageType } from '../../types/chat/message.type.ts';
import { UpdateChat } from './types/update-chat.type.ts';
import { deleteCacheOne } from '../../../common/cache/delete-chat-cache.ts';
import { Envs } from '../../../common/config/envs/envs.ts';

const initialState: StateType = {
    chats: [],
    updatedChats: [],
    messageCount: 0,
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        update(state, { payload }: PayloadAction<UpdateChat>) {
            if (payload.id === state.chatOnPage?.id) state.chatOnPage = { ...state.chatOnPage, ...payload };

            const chat = getRawChat(payload.id);
            if (!chat) return;
            const updatedChat = { ...chat, ...payload };

            if (updatedChat.readMessage && updatedChat.readMessage !== chat.readMessage) {
                const diff = updatedChat.readMessage - chat.readMessage;
                state.messageCount -= diff;
            }

            upsertChatIndexDb(updatedChat, chat.key);
            updateRawChat(updatedChat);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        updateMany(state, { payload: data }: PayloadAction<UpdateChat[]>) {
            data.forEach((payload) => {
                if (payload.id === state.chatOnPage?.id) state.chatOnPage = { ...state.chatOnPage, ...payload };
                const chat = getRawChat(payload.id);
                if (!chat) return;
                const updatedChat = { ...chat, ...payload };
                updateChatIndexDb(updatedChat);
                updateRawChat(updatedChat);
            });
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        addUpdatedChat(state, { payload }: PayloadAction<ChatItemIndexDb>) {
            const updatedChat = payload;
            const chat = getRawChat(payload.id);

            // чат был только что добавлен
            if (!chat) {
                const diff = payload.countMessages - payload.readMessage;
                state.messageCount += diff;
            }

            rawChats.updatedChats.delete(updatedChat.id);
            rawChats.updatedChats.set(updatedChat.id, updatedChat);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
        },

        createMessage(state, { payload }: PayloadAction<MessageType>) {
            // обновление страницы чата
            if (payload.chatId === state.chatOnPage?.id && payload.number > state.chatOnPage.message.number) {
                state.chatOnPage.message = payload;
                state.chatOnPage.countMessages++;

                const messages = state.chatOnPage.messages;
                const count = messages.length;
                const lastMessage = messages[count - 1];

                if (payload.number - 1 === lastMessage.number) {
                    messages.push(payload);
                    state.chatOnPage.messages = messages;
                }
            }

            const chat = getRawChat(payload.chatId);
            if (!chat) return;

            const countMessages = Math.max(payload.number, chat.countMessages);
            const messages = [...chat.messages];

            if ((chat.messages[chat.messages.length - 1]?.number ?? 1) + 1 === payload.number)
                messages.push({ ...payload, saveAt: Date.now() });

            const updatedChat: ChatItemIndexDb = {
                ...chat,
                message: payload,
                countMessages,
                messages,
                key: new Date(payload.createdAt).getTime(),
            };

            updateRawChat(updatedChat);
            upsertChatIndexDb(updatedChat, chat.key);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
            state.messageCount++;
        },

        setToBegin(state, { payload }: PayloadAction<ChatItemIndexDb>) {
            const chat = getRawChat(payload.id);
            const updatedChat: ChatItemIndexDb = {
                ...chat,
                ...payload,
            };

            if (state.chatOnPage?.id === payload.id) state.chatOnPage = { ...state.chatOnPage, ...payload };

            upsertChatIndexDb(updatedChat, chat?.key);
            rawChats.chats.delete(payload.id);
            rawChats.chats.set(payload.id, updatedChat);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        removeUpdatedChats(state, { payload }: PayloadAction<ChatType>) {
            rawChats.updatedChats.delete(payload.id);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
        },

        setToEnd(state, { payload }: PayloadAction<ChatItemIndexDb[] | undefined>) {
            if (!payload?.length) return;

            const newMap = new Map<string, ChatItemIndexDb>();

            [...payload].reverse().forEach((chat) => newMap.set(chat.id, checkChat(chat)));

            rawChats.chats = new Map<string, ChatItemIndexDb>([...newMap, ...rawChats.chats]);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        setChatOnPage(state, { payload }: PayloadAction<Partial<ChatItemIndexDb> | null>) {
            if (!payload) return;
            if (state.chatOnPage?.id && payload?.id && payload?.id !== state.chatOnPage?.id)
                state.chatOnPage = undefined;

            if (!state.chatOnPage) state.chatOnPage = payload as ChatItemIndexDb;
            if (state.chatOnPage) state.chatOnPage = { ...state.chatOnPage, ...payload };
        },

        removeChat(state, { payload }: PayloadAction<string>) {
            const chat = getRawChat(payload);
            if (!chat) return;

            const diff = chat.countMessages - chat.readMessage;
            state.messageCount = state.messageCount - diff;
            deleteChatIndexDb(chat);
            deleteChat(payload);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
        },

        setStateChat(state, { payload }: PayloadAction<Partial<StateType>>) {
            for (const [key, value] of Object.entries(payload) as [keyof StateType, StateType[keyof StateType]][]) {
                state[key] = value as never;
            }
        },
    },
});

const checkChat = (chat: ChatItemIndexDb) => {
    sliceMessages(chat);
    expiredMessages(chat);

    return { ...chat };
};

const sliceMessages = (chat: ChatItemIndexDb) => {
    const messageSaveCount = Envs.settings?.messageSaveCount;
    if (!messageSaveCount) return;

    chat.messages = [...chat.messages].slice(-messageSaveCount);
};

const expiredMessages = (chat: ChatItemIndexDb) => {
    const messageSaveTime = Envs.settings?.messageSaveTime;
    if (!messageSaveTime) return;

    deleteExpiredMessages(chat);
};

export const deleteExpiredMessages = (chat: ChatItemIndexDb) => {
    const messageSaveTime = Envs.settings?.messageSaveTime;
    if (!messageSaveTime) return;
    if (!chat.messages?.length) return;

    const message = chat.messages[0];
    if (message.saveAt + messageSaveTime > Date.now()) return;

    chat.messages = chat.messages.slice(1);
    message.files.forEach((file) => deleteCacheOne(`/${file.chatId}/${file.key}`));
    deleteExpiredMessages(chat);
};

export const ChatsActions = ChatsSlice.actions;
export const ChatReducers = ChatsSlice.reducer;
