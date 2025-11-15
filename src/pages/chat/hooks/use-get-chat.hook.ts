import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatById } from '../../../root/api/chats';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getRawChat } from '../../../root/store/raw/chats.raw.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';
import { useCustomNavigate } from '../../../common/hooks/use-custom-navigate.hook.ts';

const useGetChat = (): void => {
    const { setChatOnPage } = useAppAction();
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useCustomNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;

        if (getRawChat(id)) {
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
            return navigate('/');
        }

        if (!isLoading && chatOnPage) {
            const countMessages = chatOnPage.countMessages - chatOnPage.readMessage;

            if (countMessages > 0) changeHead(`${chatOnPage?.title} (${countMessages})`);
            else changeHead(chatOnPage?.title);
            document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
        }
    }, [isLoading, chatOnPage?.id, chatOnPage?.countMessages, chatOnPage?.readMessage]);
};

export default useGetChat;
