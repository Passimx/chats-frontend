import { Api } from '../index.ts';
import { MessageFromServerType } from '../../types/chat/message.type.ts';
import { MessagesService } from '../../../common/services/messages.service.ts';
import { CreateMessageType } from '../../types/messages/create-message.type.ts';
import { store } from '../../store';
import { ChatEnum } from '../../types/chat/chat.enum.ts';

export const createMessage = async (data: CreateMessageType) => {
    let result = true;
    const chatOnPage = store.getState().chats.chatOnPage;
    if (chatOnPage && !chatOnPage?.aesKey && [ChatEnum.IS_DIALOGUE, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)) {
        result = await MessagesService.createChatKeys(chatOnPage!);
    }

    if (result) {
        const body = await MessagesService.encryptMessage(data);
        return Api('/messages', { body, method: 'POST' });
    }
};

export const getMessages = (params: { chatId: string; limit: number; offset: number }) => {
    return MessagesService.setSaveTime(
        MessagesService.decryptMessages(params.chatId, Api<MessageFromServerType[]>('/messages', { params })),
    );
};
