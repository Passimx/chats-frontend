import { CreateMessageType } from '../../types/messages/create-message.type.ts';
import { Api } from '../index.ts';
import { MessageType } from '../../types/chat/message.type.ts';
import { Envs } from '../../../common/config/envs/envs.ts';

export const createMessage = (body: CreateMessageType) => {
    return Api('/messages', { body, method: 'POST' });
};

export const getMessages = (chatId: string) => {
    return Api<MessageType[]>('/messages', { params: { chatId, limit: Envs.messages.limit } });
};
