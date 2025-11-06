import { EventsEnum } from './events.enum.ts';
import { IData } from '../../api';
import { ChatUpdateOnlineType } from '../chat/chat-update-online.type.ts';
import { ChatUpdateMaxUsersOnline } from '../chat/chat-update-max-users-online.type.ts';
import { ChatType } from '../chat/chat.type.ts';
import { MessageType } from '../chat/message.type.ts';

type GetSocketId = {
    readonly event: EventsEnum.GET_SOCKET_ID;
    readonly data: IData<string>;
};

type UpdateChatOnline = {
    readonly event: EventsEnum.UPDATE_CHAT_ONLINE;
    readonly data: IData<ChatUpdateOnlineType[]>;
};

type MaxUsersOnline = {
    readonly event: EventsEnum.UPDATE_MAX_USERS_ONLINE;
    readonly data: IData<ChatUpdateMaxUsersOnline[]>;
};

type CreateChat = {
    readonly event: EventsEnum.CREATE_CHAT;
    readonly data: IData<ChatType>;
};

type CreateMessage = {
    readonly event: EventsEnum.CREATE_MESSAGE;
    readonly data: IData<MessageType>;
};

type Pong = {
    readonly event: EventsEnum.PONG;
    readonly data: IData<unknown>;
};

type VERIFY = {
    readonly event: EventsEnum.VERIFY;
    readonly data: string;
};

export type EventsFromServer =
    | GetSocketId
    | UpdateChatOnline
    | MaxUsersOnline
    | CreateChat
    | CreateMessage
    | Pong
    | VERIFY;
