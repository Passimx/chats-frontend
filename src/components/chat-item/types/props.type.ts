import { ChatItemIndexDb } from '../../../root/types/chat/chat.type.ts';

export type PropsType = {
    chat: ChatItemIndexDb;
    isChatOnPage: boolean;
    redirect: (url: string, state: object) => void;
    isNew?: boolean;
};
