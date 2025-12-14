export type UserType = {
    id: string;
    name: string;
    userName: string;
    aesKey: CryptoKey;
    rsaPublicKey: CryptoKey;
    rsaPrivateKey: CryptoKey;
};
