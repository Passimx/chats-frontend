import { SessionType } from '../sessions/session.type.ts';

export type UserIndexDbType = {
    id: string;
    key: number;
    name: string;
    userName: string;
    aesKey: CryptoKey;
    seedPhraseHash: string;
    encryptedRsaPrivateKey: string;
    encryptedSeedPhrase: string;
    encryptedToken: string;

    rsaPublicKey: CryptoKey;
    rsaPrivateKey?: CryptoKey;
    token?: string;
    sessions?: SessionType[];
};
