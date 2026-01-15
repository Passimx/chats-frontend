import { EventsEnum } from './events.enum.ts';
import { IData } from '../../api';
import { ChatItemIndexDb, ChatType } from '../chat/chat.type.ts';
import { MessageType } from '../chat/message.type.ts';
import { UserIndexDbType } from '../users/user-index-db.type.ts';

type GetSocketId = {
    readonly event: EventsEnum.GET_SOCKET_ID;
    readonly data: IData<string>;
};

type CreateMessage = {
    readonly event: EventsEnum.CREATE_MESSAGE;
    readonly data: IData<MessageType>;
};

type UpdateMe = {
    readonly event: EventsEnum.UPDATE_ME;
    readonly data: IData<UserIndexDbType>;
};

type Pong = {
    readonly event: EventsEnum.PONG;
    readonly data: unknown;
};

type Verify = {
    readonly event: EventsEnum.VERIFY;
    readonly data: string;
};

type JoinChat = {
    readonly event: EventsEnum.JOIN_CHAT;
    readonly data: IData<ChatType>;
};

type UpdateChat = {
    readonly event: EventsEnum.UPDATE_CHAT;
    readonly data: IData<ChatItemIndexDb>;
};

type RemoveChat = {
    readonly event: EventsEnum.LEAVE_CHAT;
    readonly data: IData<string[]>;
};

export type EventsFromServer =
    | GetSocketId
    | CreateMessage
    | UpdateMe
    | Pong
    | Verify
    | JoinChat
    | UpdateChat
    | RemoveChat;
