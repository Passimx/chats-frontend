export type UserIndexDbType = {
    id: string;
    key: number;
    name: string;
    userName: string;
    aesKey: CryptoKey;
    seedPhraseHash: string;
    encryptedRsaPrivateKey: string;
    encryptedSeedPhrase: string;

    rsaPublicKey: CryptoKey;
    rsaPrivateKey?: CryptoKey;
};
