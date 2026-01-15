import { useEffect, useState } from 'react';
import { CryptoService } from '../../../common/services/crypto.service.ts';
import { getUserMe } from '../../../root/api/users';
import { UserGetMetType } from '../../../root/types/users/user-get-met.type.ts';
import { useAppAction } from '../../../root/store';
import { EventsEnum } from '../../../root/types/events/events.enum.ts';
import { UserIndexDbType } from '../../../root/types/users/user-index-db.type.ts';

export const useVerify: (file?: File, password?: string) => [boolean, UserGetMetType | undefined] = (
    file,
    password,
) => {
    const [seedPhrase, setSeedPhrase] = useState<string>();
    const [userData, setUserData] = useState<UserGetMetType>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { postMessageToBroadCastChannel } = useAppAction();

    const postError = (data: string) => {
        postMessageToBroadCastChannel({ event: EventsEnum.SHOW_TEXT, data });
        setIsLoading(false);
    };

    const saveData = async () => {
        if (!password?.length) return;
        if (!seedPhrase?.length) return;
        if (!userData) return;

        setIsLoading(true);
        const mainSeedPhrase = `${password} ${seedPhrase}`;
        const aesKey = await CryptoService.generateAESKey(mainSeedPhrase, false);
        const rsaPrivateKeyString = await CryptoService.decryptByAESKey(aesKey, userData.encryptedRsaPrivateKey);
        const rsaPublicKey = await CryptoService.importRSAKey(userData.rsaPublicKey, ['encrypt']);
        const encryptedSeedPhrase = await CryptoService.encryptByAESKey(aesKey, seedPhrase);

        if (!rsaPrivateKeyString?.length) return postError('incorrect_password');
        if (!rsaPublicKey) return postError('incorrect_password');
        const rsaPrivateKey = await CryptoService.importRSAKey(rsaPrivateKeyString, ['decrypt']);
        if (!rsaPrivateKey) return postError('incorrect_password');

        setIsLoading(false);
        const data: Partial<UserIndexDbType> = {
            id: userData.id,
            key: Date.now(),
            name: userData.name,
            userName: userData.userName,
            aesKey,
            encryptedRsaPrivateKey: userData.encryptedRsaPrivateKey,
            encryptedSeedPhrase,
            rsaPublicKey,
            rsaPrivateKey,
        };

        postMessageToBroadCastChannel({ event: EventsEnum.CREATE_USER, data });
    };

    useEffect(() => {
        saveData();
    }, [password, userData, seedPhrase]);

    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (e) => {
            try {
                setIsLoading(true);
                const content = e.target?.result;
                if (typeof content !== 'string' || !content) return postError('wrong_file');
                const [keyString, payloadString, signatureString] = content.split('.').map((data) => atob(data));

                const dataEncoded = new TextEncoder().encode(payloadString);
                const signature = Uint8Array.from(signatureString, (c) => c.charCodeAt(0));

                const publicEd25519Key = await CryptoService.importEd25519Key(keyString, ['verify']);
                if (!publicEd25519Key) return postError('wrong_file');

                const verified = await crypto.subtle.verify('Ed25519', publicEd25519Key, signature, dataEncoded);
                if (!verified) return postError('wrong_file');
                const [userId, ...words] = payloadString.split(' ');
                const seedPhrase = words.join(' ');
                const seedPhraseHash = CryptoService.getHash(seedPhrase);

                const response = await getUserMe({ id: userId, seedPhraseHash });
                if (!response.success) return postError('wrong_file');

                setSeedPhrase(seedPhrase);
                setUserData(response.data);
            } catch (e) {
                postError('wrong_file');
            } finally {
                setIsLoading(false);
            }
        };
    }, [file]);

    return [isLoading, userData];
};
