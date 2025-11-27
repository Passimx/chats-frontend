import { Api } from '../index.ts';
import { PublicKeyType } from '../../types/chat/get-public-key.ts';
import { KeyInfType } from '../../store/app/types/state.type.ts';
import { BodyCreateDialogueType } from '../../types/chat/create-dialogue.type.ts';

export const getPublicKey = (publicKeyHash: string) => {
    return Api<PublicKeyType>('/keys/publicKey', { method: 'GET', params: { publicKeyHash } });
};

export const keepPublicKey = (body: Partial<KeyInfType>) => {
    return Api('/keys/publicKey', { method: 'POST', body });
};

export const updatePublicKey = (body: Partial<KeyInfType>) => {
    return Api('/keys/publicKey', { method: 'PATCH', body });
};

export const keepChatKey = (id: string, body: BodyCreateDialogueType) => {
    return Api(`/chats/${id}/keep_chat_key`, { method: 'POST', body });
};

export const receiveKey = (chatId: string) => {
    return Api(`/keys/receiveKey/${chatId}`, { method: 'POST', body: { chatId } });
};
