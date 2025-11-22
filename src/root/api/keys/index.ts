import { Api } from '../index.ts';
import { PublicKeyType } from '../../types/chat/get-public-key.ts';
import { KeyInfType } from '../../store/app/types/state.type.ts';

export const getPublicKey = (publicKeyHash: string) => {
    return Api<PublicKeyType>('/keys/publicKey', { method: 'GET', params: { publicKeyHash } });
};

export const keepPublicKey = (body: Partial<KeyInfType>) => {
    return Api<PublicKeyType>('/keys/publicKey', { method: 'POST', body });
};

export const updatePublicKey = (body: Partial<KeyInfType>) => {
    return Api<PublicKeyType>('/keys/publicKey', { method: 'PATCH', body });
};

export const receiveKey = (chatId: string) => {
    return Api(`/keys/receiveKey/${chatId}`, { method: 'POST', body: { chatId } });
};
