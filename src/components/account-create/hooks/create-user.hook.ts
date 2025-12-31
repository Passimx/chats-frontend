import { useCallback, useState } from 'react';
import { CryptoService } from '../../../common/services/crypto.service.ts';
import { generateUser } from '../../../root/api/users';
import { UserFromServerMe } from '../../../root/types/users/user-from-server-me.type.ts';
import { mnemonicNew } from 'ton-crypto';
import { CreateUserType, FuncType } from '../types.ts';

export const useCreateUser = (): FuncType => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createUser = useCallback(async (password: string, name: string) => {
        setIsLoading(true);
        const words = await mnemonicNew(24);
        const seedPhrase = words.join(' ');
        const mainSeedPhrase = `${password} ${seedPhrase}`;
        const passwordHash = CryptoService.getHash(password);
        const seedPhraseHash = CryptoService.getHash(seedPhrase);

        const aesKey = await CryptoService.generateAESKey(mainSeedPhrase);
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
        setIsLoading(false);
        if (!response.success) return;

        const userId = response.data.id;

        return {
            userId,
            words,
        } as CreateUserType;
    }, []);

    return [isLoading, createUser];
};
