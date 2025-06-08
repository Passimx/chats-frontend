import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import { FileType } from '../../../root/types/files/file.type.ts';

export type PropsType = {
    message: string;
    type: MessageTypeEnum;
    files: FileType[];
};
