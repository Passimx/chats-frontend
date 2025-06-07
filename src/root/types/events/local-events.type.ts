import { EventsEnum } from './events.enum.ts';
import { ChatItemIndexDb } from '../chat/chat.type.ts';
import { UpdateReadChatType } from '../chat/update-read-chat.type.ts';

type ReadMessage = {
    readonly event: EventsEnum.READ_MESSAGE;
    readonly data: UpdateReadChatType;
};

type AddChat = {
    readonly event: EventsEnum.ADD_CHAT;
    readonly data: ChatItemIndexDb;
};

type RemoveChat = {
    readonly event: EventsEnum.REMOVE_CHAT;
    readonly data: string;
};

type UpdateBadge = {
    readonly event: EventsEnum.UPDATE_BADGE;
    readonly data: number;
};

type CloseSocket = {
    readonly event: EventsEnum.CLOSE_SOCKET;
    readonly data?: unknown;
};

type PlayNotification = {
    readonly event: EventsEnum.PLAY_NOTIFICATION;
    readonly data?: unknown;
};

type Error = {
    readonly event: EventsEnum.ERROR;
    readonly data: string;
};

export type LocalEvents = ReadMessage | AddChat | RemoveChat | UpdateBadge | CloseSocket | PlayNotification | Error;
