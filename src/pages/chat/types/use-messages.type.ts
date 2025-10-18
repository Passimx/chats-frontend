import { LoadingType } from './loading.type.ts';

export type UseMessagesType = [
    LoadingType | undefined,
    (chatId: string, number: number) => void,
    () => void,
    (value: number) => void,
];
