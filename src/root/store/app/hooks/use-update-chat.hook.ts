import { useAppAction } from '../../index.ts';
import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';
import { getRawChat, getRawChats } from '../../chats/chats.raw.ts';

export const useUpdateChat = () => {
    const time = 200;
    const { addUpdatedChat, setToBegin, removeUpdatedChats, update } = useAppAction();

    return (chat: ChatItemIndexDb) => {
        if (getRawChats()[0]?.id === chat.id) return update(chat);

        addUpdatedChat(chat);

        setTimeout(() => {
            chat = getRawChat(chat.id)!;
            setToBegin(chat);
            removeUpdatedChats(chat);
        }, time);
    };
};
