import { MessageType } from '../../../root/types/chat/message.type.ts';
import { useEffect, useState } from 'react';
import rawChats from '../../../root/store/chats/chats.raw.ts';
import { getMessages } from '../../../root/api/chats';
import { useAppSelector } from '../../../root/store';
import { useParams } from 'react-router-dom';
import { getMessagesFromIndexDb } from '../../../root/store/chats/index-db/hooks.ts';

export const useGetMessages = (): MessageType[] => {
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const { id } = useParams();

    useEffect(() => {
        if (chatOnPage && chatOnPage.id === id && chatOnPage.message.number === messages[0]?.number + 1)
            setMessages([chatOnPage.message, ...messages]);
    }, [chatOnPage]);

    useEffect(() => {
        setMessages([]);

        if (!id) return;
        if (!isLoadedChatsFromIndexDb) return;

        if (rawChats.chats.get(id)) getMessagesFromIndexDb(id).then((result) => setMessages(result));
        else {
            getMessages(id).then(({ success, data }) => {
                if (success) setMessages(data);
            });
        }
    }, [id, isLoadedChatsFromIndexDb]);

    return messages;
};
