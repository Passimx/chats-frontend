import { ChatEnum } from './chat.enum.ts';
import { OpenChatType } from './message.type.ts';

type ChatItemType = {
    id: number;
    title: string;
    type: ChatEnum.IS_OPEN;
    createdAt: Date;
    countMessages: number;
    messages: OpenChatType[];
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
