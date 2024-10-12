import { ButtonEnum } from './button.enum.ts';

export type PropsType = {
    value: string;
    styleType: ButtonEnum;
    onClick: (...args: any[]) => void;
    type: 'submit' | 'reset' | 'button' | undefined;
};
