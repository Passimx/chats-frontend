import { MessageType } from '../chat/message.type.ts';
import { Types } from '../files/types.ts';

export type CreateMessageType = Partial<
    Omit<MessageType, 'files'> & {
        files: Partial<Types>[];
    }
>;
