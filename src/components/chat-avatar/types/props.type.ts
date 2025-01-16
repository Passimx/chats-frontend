import { IconEnum } from './icon.enum.ts';

export type PropsType = {
    iconType: IconEnum;
    onlineCount?: string;
    recordCount: string;
    isChange?: boolean;
};
