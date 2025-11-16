import { Api } from '../index.ts';
import { PublicKeyType } from '../../types/chat/get-public-key.ts';

export const getPublicKey = (publicKeyHash: string) => {
    return Api<PublicKeyType>('/keys/publicKey', { method: 'GET', params: { publicKeyHash } });
};

export const keepPublicKey = (publicKey: string) => {
    return Api<PublicKeyType>('/keys/publicKey', { method: 'POST', body: { publicKey } });
};

export const receiveKey = (chatId: string) => {
    return Api(`/keys/receiveKey/${chatId}`, { method: 'POST', body: { chatId } });
};
