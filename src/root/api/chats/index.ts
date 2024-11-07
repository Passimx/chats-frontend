import { Api, IData } from '../index.ts';
import { ChatItemType } from '../../types/chat/chat-item.type.ts';
import { CreateChatType } from '../../types/chat/create-chat.type.ts';

export const getChats = async (search?: string, limit?: number, offset?: number): Promise<IData<ChatItemType[]>> => {
    return Api<ChatItemType[]>('/chats', { params: { search, limit, offset } });
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

export const getChatById = async (id: string): Promise<IData<ChatItemType>> => {
    return Api<ChatItemType>(`/chats/${id}`);
};
