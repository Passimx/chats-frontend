import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import { Types } from '../../../root/types/files/types.ts';

export type PropsType = {
    message: string;
    type: MessageTypeEnum;
    files: Types[];
};
