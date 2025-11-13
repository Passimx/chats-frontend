import { ChatItemIndexDb, DialogueType } from '../../root/types/chat/chat.type.ts';
import { useCallback } from 'react';
import { Envs } from '../config/envs/envs.ts';
import { CryptoService } from '../services/crypto.service.ts';

export const usePrepareDialogue = () => {
    return useCallback(async (data: DialogueType) => {
        const { keys, ...body } = data;

        const payload: ChatItemIndexDb = {
            ...body,
            messages: [body.message],
            readMessage: 0,
            online: '1',
            maxUsersOnline: '1',
            scrollTop: 0,
        };

        const myChatKey = keys?.find((key) => key.publicKeyHash === Envs.socketId);
        const anotherChatKey = keys?.find((key) => key.publicKeyHash !== Envs.socketId);

        if (!payload.title) payload.title = anotherChatKey?.publicKeyHash;

        if (!myChatKey || !Envs.RASKeys?.privateKey) return;

        const aesKeyString = await CryptoService.decryptByRSAKey(Envs.RASKeys.privateKey, myChatKey.encryptionKey);
        if (!aesKeyString) return;

        const aesKey = await CryptoService.importEASKey(aesKeyString);

        payload.aesKeyString = aesKeyString;
        payload.aesKey = aesKey;

        return payload;
    }, []);
};
