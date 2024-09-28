import { MessageStatusEnum } from './message-status.enum.ts';

export type EncryptMessageType = {
    id: string;
    encryptMessage: string;
    status: MessageStatusEnum;
    createdAt: Date;
    updatedAt: Date;
};
