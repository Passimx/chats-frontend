import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatItemIndexDb, ChatType } from '../../types/chat/chat.type.ts';
import { StateType } from './types/state.type.ts';
import rawChats from './chats.raw.ts';
import { UpdateReadChatType } from './types/update-read-chat.type.ts';
import { deleteChatIndexDb, updateReadChat } from './index-db/hooks.ts';
import { ChatUpdateOnline } from '../../types/chat/chat-update-online.type.ts';
import { MessageType } from '../../types/chat/message.type.ts';

// const message: MessageType = {
//     id: 'fdsf',
//     message: 'Тестовое ссобщения для проверки качества сообщения в тестовой сборке',
//     chatId: 'sdf',
//     createdAt: new Date(),
//     number: 3,
//     type: MessageTypeEnum.IS_USER,
//     chat: {} as ChatItemIndexDb,
//     parentMessageId: 'sdf',
// };
//
// const chat: ChatItemIndexDb = {
//     createdAt: new Date(),
//     id: 'sdf',
//     countMessages: 33,
//     readMessage: 3,
//     title: 'Test',
//     type: ChatEnum.IS_OPEN,
//     messages: [message],
//     message,
// };

const initialState: StateType = {
    chats: [],
    updatedChats: [],
};

const ChatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        update(state, { payload }: PayloadAction<ChatItemIndexDb>) {
            rawChats.chats.set(payload.id, payload);
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        updateOnline(state, { payload }: PayloadAction<ChatUpdateOnline[]>) {
            payload.forEach(({ name, onlineUsers }) => {
                if (state.chatOnPage?.id === name) state.chatOnPage.online = onlineUsers;

                const chat = rawChats.chats.get(name);
                if (!chat) return;

                rawChats.chats.set(name, { ...chat, online: onlineUsers });
            });
            state.chats = [...Array.from(rawChats.chats.values())].reverse();
        },

        createMessage(state, { payload }: PayloadAction<MessageType>) {
            const chatFromState = rawChats.chats.get(payload.chatId);
            if (chatFromState) {
                let messages = chatFromState.messages;
                if (chatFromState?.messages[0]?.number === payload.number - 1) messages = [payload, ...messages];

                const updatedChat: ChatItemIndexDb = {
                    ...chatFromState,
                    message: payload,
                    countMessages: payload.number,
                    messages,
                };
                rawChats.chats.set(updatedChat.id, updatedChat);
                state.chats = [...Array.from(rawChats.chats.values())].reverse();
            }

            if (payload.chatId === state.chatOnPage?.id) state.chatOnPage.message = payload;
        },

        setToBegin(state, { payload }: PayloadAction<ChatItemIndexDb>) {
            rawChats.chats.delete(payload.id);
            rawChats.chats.set(payload.id, payload);
            state.chats = Array.from(rawChats.chats.values()).reverse();
        },

        updateReadChat(state, { payload }: PayloadAction<UpdateReadChatType>) {
            const { chatId, number } = payload;
            const chat = rawChats.chats.get(chatId) ?? rawChats.updatedChats.get(chatId);

            if (!chat) return;
            const updatedChat: ChatItemIndexDb = { ...chat, readMessage: number };

            rawChats.chats.set(chatId, updatedChat);
            state.chats = Array.from(rawChats.chats.values()).reverse();
            if (chatId === state.chatOnPage?.id) state.chatOnPage = updatedChat;
            updateReadChat(updatedChat);
        },

        addUpdatedChat(state, { payload }: PayloadAction<ChatItemIndexDb>) {
            rawChats.updatedChats.delete(payload.id);
            rawChats.updatedChats.set(payload.id, payload);
            state.updatedChats = [...Array.from(rawChats.updatedChats.values())].reverse();
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
