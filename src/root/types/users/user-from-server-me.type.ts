export type UserFromServerMe = {
    id: string;
    name: string;
    userName: string;
    rsaPublicKey: string;
    passwordHash: string;
    seedPhraseHash: string;
    encryptedRsaPrivateKey: string;
};
