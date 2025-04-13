import { useAppAction } from '../../../store';
import { useUpdateChat } from '../../../store/app/hooks/use-update-chat.hook.ts';
import { DataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { getRawChat } from '../../../store/chats/chats.raw.ts';
import { useLoadSoundsHooks } from './use-load-sounds.hooks.ts';
import { useCustomNavigate } from '../../../../common/hooks/use-custom-navigate.hook.ts';

export const useAppEvents = () => {
    const setToBegin = useUpdateChat();
    const navigate = useCustomNavigate();
    const [playNotificationSound] = useLoadSoundsHooks();
    const { setSocketId, updateOnline, setIsListening, updateReadChat, createMessage, removeChat } = useAppAction();

    return (dataEvent: DataType) => {
        const { event, data } = dataEvent;

        switch (event) {
            case EventsEnum.GET_SOCKET_ID:
                setSocketId(data);
                Envs.socketId = data;
                break;
            case EventsEnum.ADD_CHAT:
                setToBegin(data);
                break;
            case EventsEnum.CREATE_CHAT:
                if (!data.success) break;
                setToBegin({
                    ...data.data,
                    messages: [data.data.message],
                    readMessage: 1,
                    online: '1',
                    maxUsersOnline: 1,
                    scrollTop: 0,
                });
                navigate(`/${data.data.id}`);
                break;
            case EventsEnum.CREATE_MESSAGE:
                if (!data.success) break;
                playNotificationSound();

                createMessage(data.data);
                if (getRawChat(data.data.chatId)) setToBegin(getRawChat(data.data.chatId)!);

                break;
            case EventsEnum.READ_MESSAGE:
                updateReadChat(data);
                break;
            case EventsEnum.REMOVE_CHAT:
                removeChat(data);
                break;
            //     case EventsEnum.UPDATE_BADGE:
            //         if (navigator.setAppBadge) navigator.setAppBadge(data);
            //         break;
            case EventsEnum.UPDATE_CHAT_ONLINE:
                if (!data.success) break;
                updateOnline(data.data);
                break;
            case EventsEnum.CLOSE_SOCKET:
                setSocketId(undefined);
                setIsListening(false);
                break;
            case EventsEnum.ERROR:
                console.log(`${'\x1B[31m'}error: ${data}${'\x1B[31m'}`);
                break;
            default:
                break;
        }
    };
};
