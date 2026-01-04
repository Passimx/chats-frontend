import { Api, IData } from '../index.ts';
import { CreateChatType } from '../../types/chat/create-chat.type.ts';
import { ChatItemIndexDb, ChatType } from '../../types/chat/chat.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { BodyCreateDialogueType } from '../../types/chat/create-dialogue.type.ts';
import { MessagesService } from '../../../common/services/messages.service.ts';
import { ReadMessageType } from '../../types/chat/read-message.type.ts';

export const getChats = async (
    search?: string,
    offset?: number,
    notFavoriteChatIds?: string[],
): Promise<IData<ChatType[]>> => {
    function extractTags(text: string) {
        const matches = text.match(/#(\w+)/g); // Находим слова с `#`
        return matches ? matches.map((tag) => tag.slice(1)) : []; // Убираем `#`
    }

    function removeTags(text?: string) {
        if (!text?.length) return undefined;
        return text.replace(/#\w+/g, '').trim(); // Удаляем теги и пробелы
    }

    const tags = search?.length ? extractTags(search) : undefined;
    const titleWithoutTags = removeTags(search);

    return MessagesService.decryptChats(
        Api<ChatType[]>('/chats', {
            params: { search: titleWithoutTags, limit: Envs.chats.limit, offset, notFavoriteChatIds, tags },
        }),
    );
};

export const getChatById = async (chatId: string): Promise<ChatType | null> => {
    const response = await Api<ChatType[]>('/chats', { params: { chatIds: [chatId] } });
    if (!response.success) return null;
    const [chat] = response.data;
    return chat ?? null;
};

export const createChat = async (body: CreateChatType): Promise<IData<object>> => {
    return Api('/chats', { method: 'POST', body });
};

export const getChatByName = async (name: string): Promise<IData<ChatType | ChatItemIndexDb>> => {
    return MessagesService.decryptChat(Api<ChatType>(`/chats/${name}`));
};

export const listenChats = async (): Promise<void> => {
    await Api('/chats/listen', { method: 'POST', body: {} });
};

export const listenChat = (chatId: string, socketId: string) => {
    return Api(`/chats/${chatId}/listen`, { method: 'POST', body: { socketId } });
};

export const noListenChat = (chatId: string, socketId: string) => {
    return Api(`/chats/${chatId}/no_listen`, { method: 'POST', body: { socketId } });
};

export const getSystemChat = (): Promise<IData<ChatType[]>> => {
    return Api<ChatType[]>('/chats/system_chats');
};

export const keepChatKey = (id: string, body: BodyCreateDialogueType) => {
    return Api(`/chats/${id}/keys/keep`, { method: 'POST', body });
};

export const receiveKey = (chatId: string) => {
    return Api(`/chats/${chatId}/keys/receive`, { method: 'POST', body: { chatId } });
};

export const readMessage = (chatId: string, body: ReadMessageType) => {
    return Api(`/chats/${chatId}/messages/read`, { method: 'POST', body });
};

export const joinChat = (chatId: string) => {
    return Api(`/chats/${chatId}/join`, { method: 'POST', body: {} });
};

export const leaveChat = (chatId: string) => {
    return Api(`/chats/${chatId}/leave`, { method: 'POST', body: {} });
};

export const leaveAllChats = () => {
    return Api('/chats/all/leave', { method: 'POST', body: {} });
};
