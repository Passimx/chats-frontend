import { Api } from '../index.ts';
import { MessageFromServerType } from '../../types/chat/message.type.ts';
import { MessagesService } from '../../../common/services/messages.service.ts';
import { CreateMessageType } from '../../types/messages/create-message.type.ts';
import { store } from '../../store';
import { ChatEnum } from '../../types/chat/chat.enum.ts';
import { getRawCryptoKey } from '../../store/raw/chats.raw.ts';

export const createMessage = async (data: CreateMessageType) => {
    const chatOnPage = store.getState().chats.chatOnPage;
    console.log([chatOnPage, getRawCryptoKey(chatOnPage!.id)]);
    if (
        chatOnPage &&
        !getRawCryptoKey(chatOnPage.id) &&
        [ChatEnum.IS_DIALOGUE, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)
    )
        await MessagesService.createChatKeys(chatOnPage);

    const body = await MessagesService.encryptMessage(data);
    return Api('/messages', { body, method: 'POST' });
};

export const getMessages = (params: { chatId: string; limit: number; offset: number }) => {
    return MessagesService.setSaveTime(
        MessagesService.decryptMessages(params.chatId, Api<MessageFromServerType[]>('/messages', { params })),
    );
};
