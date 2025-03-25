import { Api, IData } from '../index.ts';
import { CreateChatType } from '../../types/chat/create-chat.type.ts';
import { ChatType } from '../../types/chat/chat.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { ChatListenRequestType } from '../../types/chat/chat-listen-request.type.ts';

export const getChats = async (
    title?: string,
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

    const tags = title?.length ? extractTags(title) : undefined;
    const titleWithoutTags = removeTags(title);

    return Api<ChatType[]>('/chats', {
        params: { title: titleWithoutTags, limit: Envs.chats.limit, offset, notFavoriteChatIds, tags },
    });
    // if (!response.success || !response.data?.length) return { ...response, data: [] };
    //
    // const getChat = async ({ lastMessage, encryptAesKey, ...data }: EncryptChatItemType): Promise<ChatItemType> => {
    //     if (!lastMessage) return { ...data, lastMessage };
    //
    //     let aesKey: CryptoKey;
    //
    //     if (data.sort === ChatEnum.IS_OPEN || data.sort === ChatEnum.IS_SHARED)
    //         aesKey = await CryptoService.importEASKey(encryptAesKey);
    //     else {
    //         // todo
    //         // поменять на замену пользовательского ключа, а не рандомного!
    //         aesKey = await CryptoService.generateAESKey('f');
    //     }
    //
    //     const { encryptMessage, ...otherData } = lastMessage;
    //     const message = await CryptoService.decryptByAESKey(aesKey, encryptMessage);
    //
    //     return { ...data, lastMessage: { ...otherData, message } };
    // };
    //
    // const chats: ChatItemType[] = await Promise.all(response.data.map((chat) => getChat(chat)));
    //
    // return { ...response, data: chats };
};

export const createChat = async (body: CreateChatType): Promise<IData<object>> => {
    return Api('/chats', { method: 'POST', body });
};

export const getChatById = async (id: string): Promise<IData<ChatType>> => {
    return Api<ChatType>(`/chats/${id}`);
};

export const listenChats = (chats: ChatListenRequestType[]) => {
    return Api<ChatType[]>('/chats/join', { method: 'POST', body: { chats } });
};

export const leaveChats = (chatIds: string[]) => {
    return Api('/chats/leave', { method: 'POST', body: { chatIds } });
};

export const getSystemChat = (): Promise<IData<ChatType>> => {
    return Api<ChatType>('/chats/chat-system');
};
