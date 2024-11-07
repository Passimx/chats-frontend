import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatById } from '../../../root/api/chats';
import { ChatItemType } from '../../../root/types/chat/chat-item.type.ts';

const useGetChat = (): [boolean, ChatItemType | null] => {
    const [chat, setChat] = useState<ChatItemType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { id } = useParams();
    const { state }: { state: ChatItemType | undefined } = useLocation();

    useEffect(() => {
        if (!id) return;

        if (state) return setChat(state);
        setIsLoading(true);

        getChatById(id).then((result) => {
            setIsLoading(false);

            if (result.success && result.data) setChat(result.data);
            else setChat(null);
        });
    }, [id]);

    return [isLoading, chat];
};

export default useGetChat;
