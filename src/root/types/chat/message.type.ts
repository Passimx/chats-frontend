import { MessageStatusEnum } from './message-status.enum.ts';

export type MessageType = {
    id: string;
    message: string;
    status: MessageStatusEnum;
    createdAt: Date;
    updatedAt: Date;
};
