import { ChatEnum } from './chat.enum.ts';
import { MessageType } from './message.type.ts';
import { ChatKeyType } from '../keys/chat-key.type.ts';

type InnerChatItemType = {
    id: string;
    title?: string;
    type: ChatEnum;
    createdAt: Date;
    countMessages: number;
    maxUsersOnline: string;
    message: MessageType;
    keys?: ChatKeyType[];
};

export type ChatType = InnerChatItemType;
export type DialogueType = ChatType;

export type ChatItemIndexDb = ChatType & {
    key?: number;
    messages: MessageType[];
    readMessage: number;
    scrollTop: number;
    online?: string;
    inputMessage?: string;
    answerMessage?: MessageType;
    pinnedMessages?: MessageType[];
    aesKeyString?: string;
};
