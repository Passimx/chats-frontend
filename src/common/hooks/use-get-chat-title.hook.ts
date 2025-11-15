import { ChatItemIndexDb } from '../../root/types/chat/chat.type.ts';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useGetChatTitle = (chat?: ChatItemIndexDb) => {
    const { t } = useTranslation();

    return useMemo(() => {
        if (!chat) return;

        let title = chat.title;
        if (chat.type === ChatEnum.IS_FAVORITES && chat.title) title = t(chat.title);
        return title;
    }, [t, chat?.id]);
};
