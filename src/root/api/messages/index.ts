import { Api } from '../index.ts';
import { MessageType } from '../../types/chat/message.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';

export const createMessage = (body: Partial<Omit<MessageType, 'files'> & { files: string[] }>) => {
    return Api('/messages', { body, method: 'POST' });
};

export const getMessages = (chatId: string, limit: number = Envs.messages.limit, offset: number = 0) => {
    return Api<MessageType[]>('/messages', { params: { chatId, limit, offset } });
};
