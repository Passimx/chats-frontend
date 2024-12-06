import { EventsEnum } from './events.enum.ts';
import { IData } from '../../api';
import { ChatType } from '../chat/chat.type.ts';
import { MessageType } from '../chat/message.type.ts';

type GetSocketId = {
    readonly event: EventsEnum.GET_SOCKET_ID;
    readonly data: string;
};

type CreateChat = {
    readonly event: EventsEnum.CREATE_CHAT;
    readonly data: IData<ChatType>;
};

type CreateMessage = {
    readonly event: EventsEnum.CREATE_MESSAGE;
    readonly data: IData<MessageType>;
};

type DataType = GetSocketId | CreateChat | CreateMessage;

export type EventDataType = {
    data: DataType;
};
