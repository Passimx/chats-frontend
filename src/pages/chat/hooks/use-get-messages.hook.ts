import { MessageType } from '../../../root/types/chat/message.type.ts';
import { useEffect, useState } from 'react';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';
import { useAppSelector } from '../../../root/store';
import { getMessages } from '../../../root/api/messages';

export const useGetMessages = (): MessageType[] => {
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        if (chatOnPage && chatOnPage.message.number === messages[0]?.number + 1 && messages[0].chatId === chatOnPage.id)
            setMessages([chatOnPage.message, ...messages]);
        // todo
        // такой подход резко открывает чат...
        // сделать сохранение позиции скролла и обновление списка соощбений как в виртуальном списке
        // const num = rawChats.chatsRead.get(chatId);
        // if (number === num) document.querySelector(`#message${num}`)?.scrollIntoView({ behavior: 'instant' });
    }, [chatOnPage?.message]);

    useEffect(() => {
        if (!chatOnPage?.id) return;
        if (!isLoadedChatsFromIndexDb) return;

        const chat = getRawChat(chatOnPage.id);

        if (chat) setMessages(chat.messages);
        else {
            setMessages([]);
            getMessages(chatOnPage.id).then(({ success, data }) => {
                if (success) setMessages(data);
            });
        }
    }, [chatOnPage?.id, isLoadedChatsFromIndexDb]);

    return messages;
};
