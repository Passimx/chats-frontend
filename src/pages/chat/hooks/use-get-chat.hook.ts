import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatById } from '../../../root/api/chats';
import { ChatType } from '../../../root/types/chat/chat.type.ts';

const useGetChat = (): [boolean, ChatType | null] => {
    const [chat, setChat] = useState<ChatType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { id } = useParams();
    const { state }: { state: ChatType | undefined } = useLocation();

    useEffect(() => {
        if (!id) return;

        if (state) {
            setIsLoading(false);
            return setChat(state);
        }
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
