import { MessageType } from '../../../root/types/chat/message.type.ts';

export type PropsType = MessageType & {
    readMessage: (chatId: string, number: number) => unknown;
};
