import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatById } from '../../../root/api/chats';
import { ChatType } from '../../../root/types/chat/chat.type.ts';

const useGetChat = (): [ChatType | null] => {
    const [chat, setChat] = useState<ChatType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { state }: { state: ChatType | undefined } = useLocation();

    useEffect(() => {
        if (!id) return;

        if (state) {
            // чтобы при обновлении страницы обнулялся state и делался запрос на сервер
            window.history.replaceState({}, '');
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

    useEffect(() => {
        if (!chat && !isLoading) {
            document.documentElement.style.setProperty('--menu-margin', '0px');
            navigate('/');
        }

        if (chat && !isLoading) {
            document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
        }
    }, [isLoading, chat]);

    return [chat];
};

export default useGetChat;
