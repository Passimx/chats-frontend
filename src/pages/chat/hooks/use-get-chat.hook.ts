import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatById } from '../../../root/api/chats';
import { ChatType } from '../../../root/types/chat/chat.type.ts';
import { useAppSelector } from '../../../root/store';
import rawChats from '../../../root/store/chats/chats.raw.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';

const useGetChat = (): [ChatType | null] => {
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [chat, setChat] = useState<ChatType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { state }: { state: ChatType | undefined } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!chatOnPage) return;
        if (chatOnPage.id === chat?.id) setChat(chatOnPage);
    }, [chatOnPage]);

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;

        if (state) {
            // чтобы при обновлении страницы обнулялся state и делался запрос на сервер
            window.history.replaceState({}, '');
            setIsLoading(false);
            return setChat(state);
        }

        if (rawChats.chats.get(id!)) {
            const chat = rawChats.chats.get(id!)!;
            setIsLoading(false);
            return setChat(chat);
        }

        setIsLoading(true);
        getChatById(id!).then((result) => {
            setIsLoading(false);

            if (result.success && result.data) setChat(result.data);
            else setChat(null);
        });
    }, [id, isLoadedChatsFromIndexDb]);

    useEffect(() => {
        if (!chat && !isLoading) {
            changeHead();
            document.documentElement.style.setProperty('--menu-margin', '0px');
            return navigate('/');
        }

        if (!isLoading) {
            changeHead(chat?.title);
            document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
        }
    }, [isLoading, chat]);

    return [chat];
};

export default useGetChat;
