import { MessageType } from '../../../root/types/chat/message.type.ts';

export type ContextType = {
    clickMessage?: MessageType;
    isShowMessageMenu?: boolean;
    setClickMessage: (value: MessageType) => void;
    setIsShowMessageMenu: (value?: boolean) => void;
};
