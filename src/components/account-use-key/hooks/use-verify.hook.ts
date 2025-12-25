import { useEffect, useState } from 'react';
import { CryptoService } from '../../../common/services/crypto.service.ts';
import { getUserMe } from '../../../root/api/users';
import { UserGetMetType } from '../../../root/types/users/user-get-met.type.ts';
import { useAppAction } from '../../../root/store';
import { Envs } from '../../../common/config/envs/envs.ts';

export const useVerify = (file?: File, password?: string) => {
    const [userData, setUserData] = useState<UserGetMetType>();
    const [seedPhrase, setSeedPhrase] = useState<string>();
    const { setStateUser } = useAppAction();

    const test = async () => {
        if (!password?.length) return;
        if (!seedPhrase?.length) return;
        if (!userData) return;

        const mainSeedPhrase = `${password} ${seedPhrase}`;
        const aesKey = await CryptoService.generateAESKey(mainSeedPhrase, false);
        const rsaPrivateKeyString = await CryptoService.decryptByAESKey(aesKey, userData.encryptedRsaPrivateKey);
        const rsaPublicKey = await CryptoService.importRSAKey(userData.rsaPublicKey, ['encrypt']);

        if (!rsaPrivateKeyString?.length) return;
        if (!rsaPublicKey) return;
        const rsaPrivateKey = await CryptoService.importRSAKey(rsaPrivateKeyString, ['decrypt']);
        if (!rsaPrivateKey) return;
        const rsaKeysPair = { privateKey: rsaPrivateKey, publicKey: rsaPublicKey };

        localStorage.setItem(
            'keys',
            JSON.stringify({ publicKey: userData.rsaPublicKey, privateKey: rsaPrivateKeyString }),
        );
        Envs.RSAKeys = rsaKeysPair;
        setStateUser({
            id: userData.id,
            key: Date.now(),
            name: userData.name,
            userName: userData.userName,
            aesKey,
            encryptedRsaPrivateKey: userData.encryptedRsaPrivateKey,
            rsaPublicKey,
            rsaPrivateKey,
        });
    };

    useEffect(() => {
        test();
    }, [password, userData, seedPhrase]);

    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (e) => {
            try {
                const content = e.target?.result;
                if (typeof content !== 'string' || !content) return;

                const [payloadString, signatureString, keyString] = content.split('\n');

                const dataEncoded = new TextEncoder().encode(payloadString);
                const signature = Uint8Array.from(atob(signatureString), (c) => c.charCodeAt(0));

                const publicEd25519Key = await CryptoService.importEd25519Key(keyString, ['verify']);
                if (!publicEd25519Key) return;

                const verified = await crypto.subtle.verify('Ed25519', publicEd25519Key, signature, dataEncoded);
                if (!verified) return;
                const [userId, ...words] = payloadString.split(' ');
                const seedPhrase = words.join(' ');
                const seedPhraseHash = CryptoService.getHash(seedPhrase);

                const response = await getUserMe({ id: userId, seedPhraseHash });
                if (!response.success) return;

                setSeedPhrase(seedPhrase);
                setUserData(response.data);
            } catch (e) {
                console.log(e);
            }
        };
    }, [file]);
};
