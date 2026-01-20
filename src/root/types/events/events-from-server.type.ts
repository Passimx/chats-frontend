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

type VideoCallStarted = {
    readonly event: EventsEnum.VIDEO_CALL_STARTED;
    readonly data: IData<{
        roomId: string;
    }>;
};

type VideoCallJoined = {
    readonly event: EventsEnum.VIDEO_CALL_JOINED;
    readonly data: IData<{
        roomId: string;
    }>;
};

type VideoCallLeft = {
    readonly event: EventsEnum.VIDEO_CALL_LEFT;
    readonly data: IData<{
        roomId: string;
        peerId?: string;
    }>;
};

type VideoCallEnded = {
    readonly event: EventsEnum.VIDEO_CALL_ENDED;
    readonly data: IData<{
        roomId: string;
    }>;
};

export type EventsFromServer =
    | GetSocketId
    | CreateMessage
    | UpdateMe
    | Pong
    | Verify
    | JoinChat
    | UpdateChat
    | RemoveChat
    | VideoCallStarted
    | VideoCallJoined
    | VideoCallLeft
    | VideoCallEnded;
