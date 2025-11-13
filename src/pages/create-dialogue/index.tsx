import { FC, memo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../root/store';
import { CryptoService } from '../../common/services/crypto.service.ts';
import { getPublicKey } from '../../root/api/keys';
import { createDialogue } from '../../root/api/chats';

export const CreateDialogue: FC = memo(() => {
    const { recipientPublicKeyHash } = useParams();
    const publicKeyString = useAppSelector((state) => state.app.RASKeysString?.publicKey);
    const publicKey = useAppSelector((state) => state.app.RASKeys?.publicKey);
    const senderPublicKeyHash = useAppSelector((state) => state.app.socketId);

    const create = useCallback(async () => {
        if (!recipientPublicKeyHash || !publicKeyString || !publicKey || !senderPublicKeyHash) return;

        const responsePublicKey = await getPublicKey(recipientPublicKeyHash);
        if (!responsePublicKey.success) return;

        const recipientPublicKey = await CryptoService.importRSAKey(responsePublicKey.data.publicKey, ['encrypt']);
        if (!recipientPublicKey) return;

        const aesKeyString = await CryptoService.generateAndExportAesKey();
        const encryptionKey = await CryptoService.encryptByRSAKey(recipientPublicKey, aesKeyString);
        if (!encryptionKey) return;

        const response = await createDialogue({ encryptionKey, recipientPublicKeyHash, senderPublicKeyHash });
        if (!response) return;
    }, [recipientPublicKeyHash, publicKeyString, publicKey, senderPublicKeyHash]);

    useEffect(() => {
        if (!recipientPublicKeyHash || !publicKeyString || !publicKey || !senderPublicKeyHash) return;
        create();
    }, [create]);

    return <div>{recipientPublicKeyHash}</div>;
});
