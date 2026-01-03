import { ChatItemIndexDb, ChatType } from '../../root/types/chat/chat.type.ts';
import { MessageType } from '../../root/types/chat/message.type.ts';
import { Envs } from '../config/envs/envs.ts';
import { CryptoService } from '../services/crypto.service.ts';
import rawChats from '../../root/store/raw/chats.raw.ts';
import { MessagesService } from '../services/messages.service.ts';
import { receiveKey } from '../../root/api/chats';
import { store } from '../../root/store';

export const prepareChat = async (data: ChatType): Promise<ChatItemIndexDb> => {
    const { keys, ...body } = data;
    let messages: MessageType[] = [];
    const chatOnPage = store.getState().chats.chatOnPage;

    // чтобы не обнулять сообщения, что уже на странице
    if (chatOnPage?.id === data.id && chatOnPage?.messages?.length) {
        messages = chatOnPage.messages;
    } else if (body.message) messages = [body.message];

    const payload: ChatItemIndexDb = {
        ...body,
        messages,
        readMessage: 0,
        scrollTop: 0,
    };

    const myChatKey = keys?.find((key) => key.userId === Envs.userId);
    if (!myChatKey || !Envs.RSAKeys?.privateKey) return payload;
    if (!myChatKey.received) await receiveKey(data.id);
    payload.readMessage = myChatKey.readMessageNumber;

    const aesKeyString = await CryptoService.decryptByRSAKey(Envs.RSAKeys.privateKey, myChatKey.encryptionKey);
    if (!aesKeyString) return payload;
    payload.aesKey = await CryptoService.importEASKey(aesKeyString, false);
    rawChats.chatKeys.set(payload.id, payload.aesKey);

    if (payload.message) payload.message = await MessagesService.decryptMessage(payload.message);
    return payload;
};
