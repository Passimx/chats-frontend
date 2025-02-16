import { IconEnum } from './icon.enum.ts';

export type PropsType = {
    iconType: IconEnum;
    onlineCount?: string;
    maxUsersOnline: number;
    isChange?: boolean;
};
