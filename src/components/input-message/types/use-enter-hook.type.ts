import { FormEvent } from 'react';

export type UseEnterHookType = [
    () => Promise<void>,
    (event: FormEvent<HTMLDivElement>) => void,
    (emoji: string) => void,
    string,
    boolean,
];
