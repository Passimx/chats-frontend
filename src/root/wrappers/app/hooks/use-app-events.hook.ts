import { useAppAction } from '../../../store';
import { DataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { useLoadSoundsHooks } from './use-load-sounds.hooks.ts';
import { ChatEnum } from '../../../types/chat/chat.enum.ts';
import { getRawChat } from '../../../store/raw/chats.raw.ts';
import { deleteAllCache } from '../../../../common/cache/delete-chat-cache.ts';
import { useCallback } from 'react';
import { useUpdateChat } from '../../../../common/hooks/use-update-chat.hook.ts';
import { MessagesService } from '../../../../common/services/messages.service.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { prepareChat } from '../../../../common/hooks/prepare-chat.ts';
import { useLeaveChat } from '../../../../common/hooks/use-leave-chat.hook.ts';
import { TabEnum } from '../../../store/app/types/state.type.ts';
import { prepareUser } from '../../../../common/hooks/prepare-user.ts';

export const useAppEvents = () => {
    const leaveChat = useLeaveChat();
    const setToBegin = useUpdateChat();
    const [playNotificationSound] = useLoadSoundsHooks();
    const { setStateApp, createMessage, update, changeSettings, setStateUser, logout } = useAppAction();

    return useCallback(async (dataEvent: DataType) => {
        const { event, data } = dataEvent;

        switch (event) {
            case EventsEnum.GET_SOCKET_ID:
                if (!data.success) break;
                setStateApp({ socketId: data.data });
                break;
            case EventsEnum.JOIN_CHAT:
                if (!data.success) break;
                if (getRawChat(data.data.id)) break;
                if (data.data.type === ChatEnum.IS_FAVORITES) setStateApp({ favoritesChatName: data.data.name });
                if (data.data.type === ChatEnum.IS_SYSTEM) setStateApp({ systemChatName: data.data.name });
                setToBegin(await prepareChat(data.data));
                playNotificationSound();
                break;
            case EventsEnum.CREATE_MESSAGE:
                if (!data.success) break;
                playNotificationSound();
                createMessage(await MessagesService.decryptMessage(data.data));
                if (getRawChat(data.data.chatId)) setToBegin(getRawChat(data.data.chatId)!);
                break;
            case EventsEnum.UPDATE_CHAT:
                if (data.success) update(data.data);
                break;
            case EventsEnum.LEAVE_CHAT:
                if (!data.success) break;
                await leaveChat(data.data);
                break;
            case EventsEnum.UPDATE_ME:
                if (!data.success) break;
                setStateUser(await prepareUser(data.data));
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
            case EventsEnum.ERROR:
                console.log(`${'\x1B[31m'}error: ${data}${'\x1B[31m'}`);
                break;
            case EventsEnum.SET_STATE_APP:
                setStateApp(data);
                break;
            case EventsEnum.CREATE_USER:
                Envs.userId = data.id;
                setStateUser(data);
                Envs.RSAKeys = { publicKey: data.rsaPublicKey!, privateKey: data.rsaPrivateKey! };
                break;
            case EventsEnum.LOGOUT:
                logout();
                await deleteAllCache();
                setStateApp({ activeTab: TabEnum.CHATS, page: undefined });
                break;

            // Тут нужно прописать кейсы на события из сервиса уведомлений, пока они не приходят вроде как, но поидее должны
            case EventsEnum.VIDEO_CALL_STARTED: {
                if (!data.success) break;
                console.log('[MEDIA] VIDEO_CALL_STARTED:', data.data);
                break;
            }
            case EventsEnum.VIDEO_CALL_JOINED: {
                if (!data.success) break;
                console.log('[MEDIA] VIDEO_CALL_JOINED:', data.data);
                break;
            }
            case EventsEnum.VIDEO_CALL_LEFT: {
                if (!data.success) break;
                console.log('[MEDIA] VIDEO_CALL_LEFT:', data.data);
                break;
            }
            case EventsEnum.VIDEO_CALL_ENDED: {
                if (!data.success) break;
                console.log('[MEDIA] VIDEO_CALL_ENDED:', data.data);
                break;
            }
        }
    }, []);
};
