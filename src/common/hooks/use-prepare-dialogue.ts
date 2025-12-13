import { ChatItemIndexDb, DialogueType } from '../../root/types/chat/chat.type.ts';
import { useCallback } from 'react';
import { Envs } from '../config/envs/envs.ts';
import { CryptoService } from '../services/crypto.service.ts';
import { setRawCryptoKey } from '../../root/store/raw/chats.raw.ts';
import { MessagesService } from '../services/messages.service.ts';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { receiveKey } from '../../root/api/keys';
import { MessageType } from '../../root/types/chat/message.type.ts';

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

        const myChatKey = keys?.find((key) => key.publicKeyHash === Envs.socketId);

        if (!myChatKey || !Envs.RASKeys?.privateKey) return;

        const aesKeyString = await CryptoService.decryptByRSAKey(Envs.RASKeys.privateKey, myChatKey.encryptionKey);
        if (!aesKeyString) return;

        const aesKey = await CryptoService.importEASKey(aesKeyString);
        setRawCryptoKey(payload.id, aesKey);

        if (payload.message) payload.message = await MessagesService.decryptMessage(payload.message);

        await receiveKey(data.id);
        return payload;
    }, []);
};
