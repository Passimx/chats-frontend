import { MessageType } from '../../../root/types/chat/message.type.ts';
import { LoadingType } from './loading.type.ts';

export type UseMessagesType = [
    LoadingType | undefined,
    MessageType[],
    (chatId: string, number: number) => void,
    () => void,
    (value: number) => void,
];
