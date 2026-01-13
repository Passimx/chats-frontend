import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatByName } from '../../../root/api/chats';
import { useAppAction, useAppSelector } from '../../../root/store';
import { getRawChatByName } from '../../../root/store/raw/chats.raw.ts';
import { changeHead } from '../../../common/hooks/change-head-inf.hook.ts';
import { useCustomNavigate } from '../../../common/hooks/use-custom-navigate.hook.ts';
import { useTranslation } from 'react-i18next';
import { ChatEnum } from '../../../root/types/chat/chat.enum.ts';
import { ChatType } from '../../../root/types/chat/chat.type.ts';
import { EventsEnum } from '../../../root/types/events/events.enum.ts';

const useGetChat = (): void => {
    const { name } = useParams();
    const { t } = useTranslation();
    const { setChatOnPage, postMessageToBroadCastChannel } = useAppAction();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useCustomNavigate();
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { isLoadedChatsFromIndexDb } = useAppSelector((state) => state.app);
    const socketId = useAppSelector((state) => state.app.socketId);
    const privateKey = useAppSelector((state) => state.user.rsaPrivateKey);
    const { state }: { state: ChatType | undefined } = useLocation();

    useEffect(() => {
        if (!isLoadedChatsFromIndexDb) return;
        if (state) setChatOnPage(state);

        if (getRawChatByName(name)) {
            const chat = getRawChatByName(name!)!;
            setIsLoading(false);
            setChatOnPage(chat);
            return;
        }

        if (!socketId) return;

        setIsLoading(true);
        getChatByName(name!).then((result) => {
            if (result.success) setChatOnPage(result.data);
            else {
                setChatOnPage(null);
                postMessageToBroadCastChannel({ event: EventsEnum.SHOW_TEXT, data: 'no_chats' });
            }

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
