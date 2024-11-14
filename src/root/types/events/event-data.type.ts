import { EventsEnum } from './events.enum.ts';
import { IData } from '../../api';
import { ChatType } from '../chat/chat.type.ts';

type GetSocketId = {
    readonly event: EventsEnum.GET_SOCKET_ID;
    readonly data: string;
};

type CreateChat = {
    readonly event: EventsEnum.CREATE_CHAT;
    readonly data: IData<ChatType>;
};

type DataType = GetSocketId | CreateChat;

export type EventDataType = {
    data: DataType;
};
