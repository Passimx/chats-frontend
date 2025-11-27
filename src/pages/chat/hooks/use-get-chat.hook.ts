import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatByName } from '../../../root/api/chats';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getRawChatByName } from '../../../root/store/raw/chats.raw.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';
import { useCustomNavigate } from '../../../common/hooks/use-custom-navigate.hook.ts';
import { useTranslation } from 'react-i18next';
import { ChatEnum } from '../../../root/types/chat/chat.enum.ts';

const useGetChat = (): void => {
    const { name } = useParams();
    const { t } = useTranslation();
    const { setChatOnPage } = useAppAction();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useCustomNavigate();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const socketId = useAppSelector((state) => state.app.socketId);
    const privateKey = useAppSelector((state) => state.app.keyInf?.RASKeys?.privateKey);

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;

        if (getRawChatByName(name)) {
            const chat = getRawChatByName(name!)!;
            setIsLoading(false);
            setChatOnPage(chat);
            return;
        }

        if (!socketId || !privateKey) return;

        setIsLoading(true);
        getChatByName(name!).then((result) => {
            setChatOnPage(null);
            if (result.success && result.data) setChatOnPage(result.data);
            else setChatOnPage(null);

            setIsLoading(false);
        });
    }, [name, isLoadedChatsFromIndexDb, socketId, privateKey]);

    useEffect(() => {
        if (!chatOnPage && !isLoading) {
            changeHead();
            document.documentElement.style.setProperty('--menu-margin', '0px');
            return navigate('/');
        }

        if (!isLoading && chatOnPage?.title) {
            let title = chatOnPage.title;
            const countMessages = chatOnPage.countMessages - chatOnPage.readMessage;

            if (chatOnPage.type === ChatEnum.IS_FAVORITES) title = t(chatOnPage.title);
            if (countMessages > 0) changeHead(`${title} (${countMessages})`);
            else changeHead(title);
            document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
        }
    }, [isLoading, chatOnPage?.id, chatOnPage?.countMessages, chatOnPage?.readMessage, t]);
};

export default useGetChat;
