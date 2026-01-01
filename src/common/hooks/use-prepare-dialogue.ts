import { ChatItemIndexDb, DialogueType } from '../../root/types/chat/chat.type.ts';
import { useCallback } from 'react';
import { Envs } from '../config/envs/envs.ts';
import { CryptoService } from '../services/crypto.service.ts';
import { MessagesService } from '../services/messages.service.ts';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { MessageType } from '../../root/types/chat/message.type.ts';
import { receiveKey } from '../../root/api/chats';
import rawChats from '../../root/store/raw/chats.raw.ts';

export const usePrepareDialogue = () => {
    return useCallback(async (data: DialogueType) => {
        const { keys, ...body } = data;
        let readMessage = 0;
        if (data.type === ChatEnum.IS_FAVORITES) readMessage = data.countMessages;
        const messages: MessageType[] = [];
        if (body.message) messages.push(body.message);

        const payload: ChatItemIndexDb = {
            ...body,
            readMessage,
            messages,
            online: '1',
            maxUsersOnline: '1',
            scrollTop: 0,
        };

        const myChatKey = keys?.find((key) => key.userId === Envs.userId);

        if (!myChatKey || !Envs.RSAKeys?.privateKey) return;

        const aesKeyString = await CryptoService.decryptByRSAKey(Envs.RSAKeys.privateKey, myChatKey.encryptionKey);
        if (!aesKeyString) return;
        payload.aesKey = await CryptoService.importEASKey(aesKeyString, false);
        rawChats.chatKeys.set(payload.id, payload.aesKey);

        if (payload.message) payload.message = await MessagesService.decryptMessage(payload.message);

        await receiveKey(data.id);
        return payload;
    }, []);
};
