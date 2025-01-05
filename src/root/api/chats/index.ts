import { Api, IData } from '../index.ts';
import { CreateChatType } from '../../types/chat/create-chat.type.ts';
import { CreateMessageType } from '../../types/chat/create-message.type.ts';
import { ChatType } from '../../types/chat/chat.type.ts';
import { MessageType } from '../../types/chat/message.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';

export const getChats = async (
    title?: string,
    offset?: number,
    notFavoriteChatIds?: string[],
): Promise<IData<ChatType[]>> => {
    return Api<ChatType[]>('/chats', { params: { title, limit: Envs.chats.limit, offset, notFavoriteChatIds } });
    // const response = await Api<EncryptChatItemType[]>('/chats', { params: { search, limit, offset } });
    //
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

export const createMessage = (body: CreateMessageType) => {
    return Api('/messages', { body, method: 'POST' });
};

export const listenChats = (favoriteChatIds: string[]) => {
    return Api('/chats/join', { method: 'POST', body: { favoriteChatIds } });
};

export const leaveChats = (favoriteChatIds: string[]) => {
    return Api('/chats/leave', { method: 'POST', body: { favoriteChatIds } });
};

export const getMessages = (chatId: string) => {
    return Api<MessageType[]>('/messages', { params: { chatId, limit: Envs.messages.limit } });
};
