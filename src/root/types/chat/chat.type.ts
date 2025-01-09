import { ChatEnum } from './chat.enum.ts';
import { MessageType } from './message.type.ts';

type ChatItemType = {
    id: string;
    title: string;
    type: ChatEnum;
    createdAt: Date;
    countMessages: number;
    message: MessageType;
};

// type EncryptChatItemType = {
//     id: string;
//     title: string;
//     type: ChatEnum.IS_PRIVATE;
//     countMessages: number;
//     createdAt: Date;
//     messages: EncryptChatType[];
//     // encryptAesKey: string;
//     // lastMessage: null | EncryptMessageType;
//     // countIsNotReadMessages: number;
// };
export type ChatType = ChatItemType;

export type ChatItemIndexDb = ChatType & { messages: MessageType[]; readMessage: number };
