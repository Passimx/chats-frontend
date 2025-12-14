import { useCallback, useState } from 'react';
import { CryptoService } from '../../../common/services/crypto.service.ts';
import { useAppAction } from '../../../root/store';
import { generateUser } from '../../../root/api/users';
import { UserFromServerMe } from '../../../root/types/chat/users/user-from-server-me.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';

type FuncType = [boolean, (words: string[], password: string, name: string) => any];
export const useCreateUser = (): FuncType => {
    const { setStateUser } = useAppAction();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createUser = useCallback(async (words: string[], password: string, name: string) => {
        setIsLoading(true);
        const seedPhrase = words.join(' ');
        const passwordHash = CryptoService.getHash(password);
        const seedPhraseHash = CryptoService.getHash(seedPhrase);
        const aesKey = await CryptoService.generateAESKey(seedPhrase);
        const rsaKeysPair = await CryptoService.generateRSAKeys();
        const publicKeyString = await CryptoService.exportKey(rsaKeysPair.publicKey);
        const privateKeyString = await CryptoService.exportKey(rsaKeysPair.privateKey);

        const encryptedRsaPrivateKey = await CryptoService.encryptByAESKey(aesKey, privateKeyString);
        const userRequest: Partial<UserFromServerMe> = {
            encryptedRsaPrivateKey,
            rsaPublicKey: publicKeyString,
            name,
            passwordHash,
            seedPhraseHash,
        };

        const response = await generateUser(userRequest);
        // todo
        // удалить после того как в notifications service можно будет стучаться по токену
        localStorage.setItem('keys', JSON.stringify({ publicKey: publicKeyString, privateKey: privateKeyString }));

        setIsLoading(false);
        if (!response.success) return;
        const data = response.data;

        Envs.RASKeys = rsaKeysPair;
        setStateUser({
            key: Date.now(),
            aesKey,
            id: data.id,
            name: data.name,
            seedPhraseHash,
            userName: data.userName,
            rsaPublicKey: rsaKeysPair.publicKey,
            rsaPrivateKey: rsaKeysPair.privateKey,
        });
    }, []);

    return [isLoading, createUser];
};
