import { FC, memo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../root/store';
import { CryptoService } from '../../common/services/crypto.service.ts';
import { getPublicKey } from '../../root/api/keys';
import { createDialogue } from '../../root/api/chats';
import { DialogueKey } from '../../root/types/chat/create-dialogue.type.ts';
import { useCustomNavigate } from '../../common/hooks/use-custom-navigate.hook.ts';

export const CreateDialogue: FC = memo(() => {
    const navagate = useCustomNavigate();
    const { recipientPublicKeyHash } = useParams();
    const publicKeyString = useAppSelector((state) => state.app.RASKeysString?.publicKey);
    const publicKey = useAppSelector((state) => state.app.RASKeys?.publicKey);
    const senderPublicKeyHash = useAppSelector((state) => state.app.socketId);

    const create = useCallback(async () => {
        if (!recipientPublicKeyHash || !publicKeyString || !publicKey || !senderPublicKeyHash) return;

        const keys: DialogueKey[] = [];
        const aesKeyString = await CryptoService.generateAndExportAesKey();
        const senderEncryptionKey = await CryptoService.encryptByRSAKey(publicKey, aesKeyString);
        if (!senderEncryptionKey) return;
        keys.push({ publicKeyHash: senderPublicKeyHash, encryptionKey: senderEncryptionKey });

        if (recipientPublicKeyHash !== senderPublicKeyHash) {
            const responsePublicKey = await getPublicKey(recipientPublicKeyHash);
            if (!responsePublicKey.success) return;
            const recipientPublicKey = await CryptoService.importRSAKey(responsePublicKey.data.publicKey, ['encrypt']);
            if (!recipientPublicKey) return;
            const recipientEncryptionKey = await CryptoService.encryptByRSAKey(recipientPublicKey, aesKeyString);
            if (!recipientEncryptionKey) return;
            keys.push({ publicKeyHash: recipientPublicKeyHash, encryptionKey: recipientEncryptionKey });
        }

        await createDialogue({ keys });
    }, [recipientPublicKeyHash, publicKeyString, publicKey, senderPublicKeyHash]);

    useEffect(() => {
        if (!recipientPublicKeyHash || !publicKeyString || !publicKey || !senderPublicKeyHash) return;
        create().then(() => navagate('/'));
    }, [create]);

    return <div>{recipientPublicKeyHash}</div>;
});
