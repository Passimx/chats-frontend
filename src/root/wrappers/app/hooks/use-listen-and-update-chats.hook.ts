import { useAppAction, useAppSelector } from '../../../store';
import { useEffect } from 'react';
import { listenChats } from '../../../api/chats';
import { rawApp } from '../../../store/app/app.raw.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { prepareChat } from '../../../../common/hooks/prepare-chat.ts';

export const useListenAndUpdateChats = () => {
    const { postMessageToBroadCastChannel, updateMany } = useAppAction();
    const { socketId, isLoadedChatsFromIndexDb, isOnline, isListening } = useAppSelector((state) => state.app);

    useEffect(() => {
        if (!rawApp.isMainTab) return;
        if (!socketId || !isLoadedChatsFromIndexDb || !isOnline) return;
        if (isListening) return;

        listenChats()
            .then(async (response) => {
                if (!response.success) return;
                postMessageToBroadCastChannel({ event: EventsEnum.SET_STATE_APP, data: { isListening: true } });
                const chats = await Promise.all(response.data.reverse().map((chat) => prepareChat(chat)));

                updateMany(chats);
            })
            .catch(() => window.location.reload());
    }, [socketId, isLoadedChatsFromIndexDb, isOnline, isListening]);
};
