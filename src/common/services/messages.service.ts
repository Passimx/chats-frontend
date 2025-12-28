import { MessageFromServerType, MessageType } from '../../root/types/chat/message.type.ts';
import { IData } from '../../root/api';
import { CryptoService } from './crypto.service.ts';
import { ChatType } from '../../root/types/chat/chat.type.ts';
import { Envs } from '../config/envs/envs.ts';
import { CreateMessageType } from '../../root/types/messages/create-message.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { FilesType } from '../../root/types/files/types.ts';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { CreateChatKeyType } from '../../root/types/chat/create-dialogue.type.ts';
import { getUserByUserName } from '../../root/api/users';
import { keepChatKey } from '../../root/api/chats';
import { getRawChat } from '../../root/store/raw/chats.raw.ts';
import { store } from '../../root/store';
import { ChatsActions } from '../../root/store/chats/chats.slice.ts';

export class MessagesService {
    public static async setSaveTime(request: Promise<IData<MessageFromServerType[]>>) {
        const response = await request;
        if (!response.success) return response;

        const data = response.data.map<MessageType>((message) => ({ ...message, saveAt: Date.now() }));
        return { ...response, data };
    }

    public static async decryptMessages(
        chatId: string,
        request: Promise<IData<MessageFromServerType[]>>,
    ): Promise<IData<MessageFromServerType[]>> {
        const response = await request;
        const aesKey = getRawChat(chatId)?.aesKey;
        if (!aesKey) return request;

        if (!response.success) return response;

        const tasks = response.data.map<Promise<MessageFromServerType>>((message) => this.decryptMessage(message));

        response.data = await Promise.all(tasks);

        return response;
    }

    public static async decryptMessage<T extends MessageFromServerType>(data: T): Promise<T> {
        if (data.type !== MessageTypeEnum.IS_USER) return data;

        const aesKey = getRawChat(data.chatId)?.aesKey;
        if (!aesKey) return data;

        if (data.message) {
            const text = await CryptoService.decryptByAESKey(aesKey!, data.message);
            if (text) data.message = text;
        }

        return data;
    }

    public static async keepAesKey(request: Promise<IData<ChatType>>): Promise<IData<ChatType>> {
        const response = await request;
        if (!Envs.RSAKeys?.privateKey) return request;
        if (!response.success) return response;
        if (!response.data?.keys?.length) return response;

        const myKey = response.data.keys.find((key) => key.userId === Envs.userId);
        if (!myKey) return response;

        const aesKeyString = await CryptoService.decryptByRSAKey(Envs.RSAKeys?.privateKey, myKey.encryptionKey);
        if (!aesKeyString) return response;

        const aesKey = await CryptoService.importEASKey(aesKeyString);
        store.dispatch(ChatsActions.update({ id: response.data.id, aesKey }));

        return response;
    }

    public static async decryptChat(request: Promise<IData<ChatType>>): Promise<IData<ChatType>> {
        const response = await request;
        if (!response.success) return response;
        const aesKey = getRawChat(response.data.id)?.aesKey;
        if (!aesKey) return request;

        if (!response.success) return response;

        if (response.data.type === ChatEnum.IS_DIALOGUE && !response?.data?.title?.length) {
            const anotherChatKey = response.data.keys?.find((key) => key.userId !== Envs.userId);
            response.data.title = anotherChatKey?.userId;
        }

        if (response.data.message) response.data.message = await this.decryptMessage(response.data.message);
        return response;
    }

    public static async decryptChats(request: Promise<IData<ChatType[]>>): Promise<IData<ChatType[]>> {
        const response = await request;
        if (!response.success) return response;

        const tasks = response.data.map(async (chat) => {
            const aesKey = getRawChat(chat.id)?.aesKey;
            if (!aesKey) return chat;

            if (chat.message) chat.message = await this.decryptMessage(chat.message);
            return chat;
        });

        response.data = await Promise.all(tasks);
        return response;
    }

    public static async encryptMessage(body: CreateMessageType): Promise<CreateMessageType> {
        if (!body.chatId) return body;
        const aesKey = getRawChat(body.chatId)?.aesKey;
        if (!aesKey) return body;

        if (body.message?.length) {
            body.message = await CryptoService.encryptByAESKey(aesKey, body.message);
        }

        return body;
    }

    public static async encryptFormData(formData: FormData) {
        const chatId = formData.get('chatId') as string | undefined;
        if (!chatId) return formData;

        const aesKey = getRawChat(chatId)?.aesKey;
        if (!aesKey) return formData;

        for (const [key, value] of formData.entries()) {
            if (key === 'file') {
                const file = value as FilesType;
                const encrypted = await CryptoService.encryptFile(file, aesKey);
                formData.set(key, encrypted);
            }
        }

        return formData;
    }

    public static async createChatKeys(chat: ChatType): Promise<boolean> {
        if (!chat.keys?.length) return false;

        const keys: CreateChatKeyType[] = [];
        const aesKeyString = await CryptoService.generateAndExportAesKey(undefined, true);
        const aesKey = await CryptoService.importEASKey(aesKeyString);

        const tasks = chat.keys.map(async ({ userId }) => {
            const response = await getUserByUserName(userId);
            if (!response.success) return;

            const publicKey = await CryptoService.importRSAKey(response.data.rsaPublicKey, ['encrypt']);
            if (!publicKey) return;
            const encryptionKey = await CryptoService.encryptByRSAKey(publicKey, aesKeyString);
            if (!encryptionKey) return;
            keys.push({ userId, encryptionKey });
        });

        await Promise.all(tasks);
        await keepChatKey(chat.id, { keys });
        store.dispatch(ChatsActions.update({ id: chat.id, aesKey }));

        return true;
    }
}
