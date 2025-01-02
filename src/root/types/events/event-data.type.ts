import { EventsEnum } from './events.enum.ts';
import { IData } from '../../api';
import { ChatType } from '../chat/chat.type.ts';
import { MessageType } from '../chat/message.type.ts';
import { UpdateReadChatType } from '../../store/chats/types/update-read-chat.type.ts';

type GetSocketId = {
    readonly event: EventsEnum.GET_SOCKET_ID;
    readonly data: string | undefined;
};

type CreateChat = {
    readonly event: EventsEnum.CREATE_CHAT;
    readonly data: IData<ChatType>;
};

type CreateMessage = {
    readonly event: EventsEnum.CREATE_MESSAGE;
    readonly data: IData<MessageType>;
};

type ReadMessage = {
    readonly event: EventsEnum.READ_MESSAGE;
    readonly data: UpdateReadChatType;
};

type RemoveChat = {
    readonly event: EventsEnum.REMOVE_CHAT;
    readonly data: string;
};

type CloseSocket = {
    readonly event: EventsEnum.CLOSE_SOCKET;
    readonly data: unknown;
};

type Error = {
    readonly event: EventsEnum.ERROR;
    readonly data: string;
};

type DataType = GetSocketId | CreateChat | CreateMessage | ReadMessage | RemoveChat | CloseSocket | Error;

export type EventDataType = {
    data: DataType;
};
