import { ParseMessagePartType } from './parse-message-part.type.ts';

export type CreateMessageType = {
    chatId: string;
    message: ParseMessagePartType[];
};
