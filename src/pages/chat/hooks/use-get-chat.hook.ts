import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatById } from '../../../root/api/chats';
import { ChatType } from '../../../root/types/chat/chat.type.ts';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getRawChat } from '../../../root/store/chats/chats.raw.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';

const useGetChat = (): void => {
    const { setChatOnPage } = useAppAction();
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { state }: { state: ChatType | undefined } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;

        if (state) {
            // чтобы при обновлении страницы обнулялся state и делался запрос на сервер
            window.history.replaceState({}, '');
            setIsLoading(false);
            setChatOnPage(state);
            return;
        }

        if (getRawChat(id!)) {
            const chat = getRawChat(id!)!;
            setIsLoading(false);
            setChatOnPage(chat);
            return;
        }

        setIsLoading(true);
        getChatById(id!).then((result) => {
            setIsLoading(false);

            if (result.success && result.data) setChatOnPage(result.data);
            else setChatOnPage(null);
        });
    }, [id, isLoadedChatsFromIndexDb]);

    useEffect(() => {
        if (!chatOnPage && !isLoading) {
            changeHead();
            document.documentElement.style.setProperty('--menu-margin', '0px');
            return navigate('/', { replace: true });
        }

        if (!isLoading) {
            changeHead(chatOnPage?.title);
            document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
        }
    }, [isLoading, chatOnPage?.id]);
};

export default useGetChat;
