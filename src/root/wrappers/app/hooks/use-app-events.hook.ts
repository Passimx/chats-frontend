import { useAppAction } from '../../../store';
import { DataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { useLoadSoundsHooks } from './use-load-sounds.hooks.ts';
import { ChatEnum } from '../../../types/chat/chat.enum.ts';
import { getRawChat } from '../../../store/raw/chats.raw.ts';
import { deleteChatCache } from '../../../../common/cache/delete-chat-cache.ts';
import { useCallback } from 'react';
import { getCacheMemory } from '../../../../common/cache/get-cache-memory.ts';
import { useUpdateChat } from '../../../../common/hooks/use-update-chat.hook.ts';
import { usePrepareDialogue } from '../../../../common/hooks/use-prepare-dialogue.ts';
import { MessagesService } from '../../../../common/services/messages.service.ts';

export const useAppEvents = () => {
    const setToBegin = useUpdateChat();
    const prepareDialogue = usePrepareDialogue();
    const [playNotificationSound] = useLoadSoundsHooks();
    const { updateMany, setStateApp, createMessage, removeChat, update, changeSettings } = useAppAction();

    return useCallback(async (dataEvent: DataType) => {
        const { event, data } = dataEvent;

        switch (event) {
            case EventsEnum.GET_SOCKET_ID:
                if (!data.success) break;
                setStateApp({ socketId: data.data });
                Envs.socketId = data.data;
                break;
            case EventsEnum.ADD_CHAT:
                if (getRawChat(data.id)) break;
                setToBegin(data);
                if (data.type === ChatEnum.IS_SYSTEM) setStateApp({ systemChatName: data.name });
                playNotificationSound();
                break;
            case EventsEnum.CREATE_CHAT:
                if (!data.success) break;
                if (getRawChat(data.data.id)) break;
                setToBegin({
                    ...data.data,
                    messages: data.data.message ? [data.data.message] : [],
                    readMessage: 0,
                    online: '1',
                    maxUsersOnline: '1',
                    scrollTop: 0,
                });
                playNotificationSound();
                break;
            case EventsEnum.CREATE_DIALOGUE:
                if (!data.success) break;
                if (getRawChat(data.data.id)) break;
                if (data.data.type === ChatEnum.IS_FAVORITES) setStateApp({ favoritesChatName: data.data.name });
                setToBegin(await prepareDialogue(data.data));
                playNotificationSound();
                break;
            case EventsEnum.CREATE_MESSAGE:
                if (!data.success) break;
                playNotificationSound();
                createMessage(await MessagesService.decryptMessage(data.data));
                if (getRawChat(data.data.chatId)) setToBegin(getRawChat(data.data.chatId)!);
                break;
            case EventsEnum.READ_MESSAGE:
                update(data);
                break;
            case EventsEnum.REMOVE_CHAT:
                removeChat(data);
                await deleteChatCache(data);
                setStateApp(await getCacheMemory());
                break;
            case EventsEnum.UPDATE_CHAT_ONLINE:
                if (!data.success) break;
                updateMany(data.data);
                break;

            case EventsEnum.UPDATE_MAX_USERS_ONLINE:
                if (!data.success) break;
                data.data.forEach(({ id, maxUsersOnline }) => {
                    const chat = getRawChat(id);
                    if (!chat) return;
                    if (Number(maxUsersOnline) > Number(chat.maxUsersOnline)) update({ id, maxUsersOnline });
                });
                break;
            case EventsEnum.CLOSE_SOCKET:
                setStateApp({ socketId: undefined, isListening: false });
                break;
            case EventsEnum.PLAY_NOTIFICATION:
                playNotificationSound();
                break;
            case EventsEnum.CHANGE_LANGUAGE:
                changeSettings({ lang: data });
                break;
            case EventsEnum.COPY_TEXT:
                await navigator.clipboard.writeText(data);
                break;
            case EventsEnum.ERROR:
                console.log(`${'\x1B[31m'}error: ${data}${'\x1B[31m'}`);
                break;
        }
    }, []);
};
