import { Api, IData } from '../index.ts';
import { MessageFromServerType, MessageType } from '../../types/chat/message.type.ts';
import { Types } from '../../types/files/types.ts';

const setSaveTime = async (request: Promise<IData<MessageFromServerType[]>>): Promise<IData<MessageType[]>> => {
    const response = await request;
    if (!response.success) return response;

    const data = response.data.map<MessageType>((message) => ({ ...message, saveAt: Date.now() }));
    return { ...response, data };
};

export const createMessage = (
    body: Partial<
        Omit<MessageType, 'files'> & {
            files: Partial<Types>[];
        }
    >,
) => {
    return Api('/messages', { body, method: 'POST' });
};

export const getMessages = (params: { chatId: string; limit: number; offset: number }) => {
    return setSaveTime(Api<MessageFromServerType[]>('/messages', { params }));
};
