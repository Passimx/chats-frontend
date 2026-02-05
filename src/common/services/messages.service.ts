import { MessageFromServerType, MessageType } from '../../root/types/chat/message.type.ts';
import { IData } from '../../root/api';
import { CryptoService } from './crypto.service.ts';
import { ChatItemIndexDb, ChatType } from '../../root/types/chat/chat.type.ts';
import { CreateMessageType } from '../../root/types/messages/create-message.type.ts';
import { MessageTypeEnum } from '../../root/types/chat/message-type.enum.ts';
import { FilesType } from '../../root/types/files/types.ts';
import { CreateChatKeyType } from '../../root/types/chat/create-dialogue.type.ts';
import { getUserByUserName } from '../../root/api/users';
import { keepChatKey } from '../../root/api/chats';
import rawChats, { getRawChat } from '../../root/store/raw/chats.raw.ts';
import { store } from '../../root/store';
import { ChatsActions } from '../../root/store/chats/chats.slice.ts';
import { prepareChat } from '../hooks/prepare-chat.ts';

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
        const aesKey = getRawChat(chatId)?.aesKey ?? rawChats.chatKeys.get(chatId);
        if (!aesKey) return request;

        if (!response.success) return response;

        const tasks = response.data.map<Promise<MessageFromServerType>>((message) => this.decryptMessage(message));

        response.data = await Promise.all(tasks);

        return response;
    }

    public static async decryptMessage<T extends MessageFromServerType>(data: T): Promise<T> {
        if (data.type !== MessageTypeEnum.IS_USER) return data;

        const aesKey = getRawChat(data.chatId)?.aesKey ?? rawChats?.chatKeys.get(data.chatId);
        if (!aesKey) return data;

        if (data.message) {
            const text = await CryptoService.decryptByAESKey(aesKey!, data.message);
            if (text) data.message = text;
        }

        return data;
    }

    public static async decryptChat(request: Promise<IData<ChatType>>): Promise<IData<ChatType | ChatItemIndexDb>> {
        const response = await request;
        if (response.success) response.data = await prepareChat(response.data);
        return response;
    }

    public static async decryptChats(
        request: Promise<IData<ChatType[]>>,
    ): Promise<IData<(ChatType | ChatItemIndexDb)[]>> {
        const response = await request;
        if (response.success) response.data = await Promise.all(response.data.map((chat) => prepareChat(chat)));
        return response;
    }

    public static async encryptMessage(body: CreateMessageType): Promise<CreateMessageType> {
        if (!body.chatId) return body;
        const aesKey = getRawChat(body.chatId)?.aesKey ?? rawChats.chatKeys.get(body.chatId);
        if (!aesKey) return body;

        if (body.message?.length) {
            body.message = await CryptoService.encryptByAESKey(aesKey, body.message);
        }

        return body;
    }

    public static async encryptFormData(formData: FormData) {
        const chatId = formData.get('chatId') as string | undefined;
        if (!chatId) return formData;

        const aesKey = getRawChat(chatId)?.aesKey ?? rawChats.chatKeys.get(chatId);
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
            const me = store.getState().user;
            let publicKey: CryptoKey | undefined;
            if (me.id === userId) {
                publicKey = me.rsaPublicKey;
            } else {
                const response = await getUserByUserName(userId);
                if (!response.success) return;
                publicKey = await CryptoService.importRSAKey(response.data.rsaPublicKey, ['encrypt']);
            }

            if (!publicKey) return;
            const encryptionKey = await CryptoService.encryptByRSAKey(publicKey, aesKeyString);
            if (!encryptionKey) return;
            keys.push({ userId, encryptionKey });
        });

        await Promise.all(tasks);
        const response = await keepChatKey(chat.id, { keys });

        if (response?.success !== false) {
            store.dispatch(ChatsActions.update({ id: chat.id, aesKey }));
            rawChats.chatKeys.set(chat.id, aesKey);
            return true;
        }

        return false;
    }
}
