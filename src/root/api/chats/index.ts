import { Api, IData } from '../index.ts';
import { CreateChatType } from '../../types/chat/create-chat.type.ts';
import { ChatType } from '../../types/chat/chat.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { ChatListenRequestType } from '../../types/chat/chat-listen-request.type.ts';
import { BodyCreateDialogueType } from '../../types/chat/create-dialogue.type.ts';
import { MessagesService } from '../../../common/services/messages.service.ts';

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

    return Api<ChatType[]>('/chats', {
        params: { search: titleWithoutTags, limit: Envs.chats.limit, offset, notFavoriteChatIds, tags },
    });
};

export const createChat = async (body: CreateChatType): Promise<IData<object>> => {
    return Api('/chats', { method: 'POST', body });
};

export const getChatById = async (id: string): Promise<IData<ChatType>> => {
    return MessagesService.decryptChat(id, MessagesService.keepAesKey(Api<ChatType>(`/chats/${id}`)));
};

export const listenChats = (chats: ChatListenRequestType[]) => {
    return MessagesService.decryptChats(Api<ChatType[]>('/chats/join', { method: 'POST', body: { chats } }));
};

export const leaveChats = (chatIds: string[]) => {
    return Api('/chats/leave', { method: 'POST', body: { chatIds } });
};

export const getSystemChat = (): Promise<IData<ChatType[]>> => {
    return Api<ChatType[]>('/chats/system_chats');
};

export const createDialogue = (body: BodyCreateDialogueType) => {
    return Api<ChatType>('/dialogues', { method: 'POST', body });
};
