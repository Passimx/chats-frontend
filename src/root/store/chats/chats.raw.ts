import { ChatType } from '../../types/chat/chat.type.ts';

const rawChats = {
    chats: new Map<number, ChatType>(),
    updatedChats: new Map<number, ChatType>(),
};

export default rawChats;
