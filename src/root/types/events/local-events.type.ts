import { EventsEnum } from './events.enum.ts';
import { UserIndexDbType } from '../users/user-index-db.type.ts';

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

type ChangeLanguage = {
    readonly event: EventsEnum.CHANGE_LANGUAGE;
    readonly data: string;
};

type ShowText = {
    readonly event: EventsEnum.SHOW_TEXT;
    readonly data: string;
};

type CreateUser = {
    readonly event: EventsEnum.CREATE_USER;
    readonly data: Partial<UserIndexDbType>;
};

export type LocalEvents =
    | RemoveChat
    | UpdateBadge
    | CloseSocket
    | PlayNotification
    | Error
    | ChangeLanguage
    | ShowText
    | CreateUser;
