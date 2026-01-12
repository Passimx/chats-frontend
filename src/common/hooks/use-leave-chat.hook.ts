import { useCallback } from 'react';
import { store, useAppAction } from '../../root/store';
import { useCustomNavigate } from './use-custom-navigate.hook.ts';
import { changeHead } from './change-head-inf.hook.ts';
import { deleteChatCache } from '../cache/delete-chat-cache.ts';

export const useLeaveChat = () => {
    const { removeChat, setChatOnPage } = useAppAction();
    const navigate = useCustomNavigate();

    return useCallback(async (ids: string[]) => {
        const chatOnPage = store.getState().chats.chatOnPage;

        const tasks = ids?.map(async (id) => {
            if (chatOnPage?.id === id) {
                setChatOnPage(null);
                changeHead();
                navigate('/');
            }

            removeChat(id);
            await deleteChatCache(id);
        });

        await Promise.all(tasks);
    }, []);
};
