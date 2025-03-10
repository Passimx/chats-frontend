import { useEffect } from 'react';
// import { EventDataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { useUpdateChat } from '../../../store/app/hooks/use-update-chat.hook.ts';
import { useAppAction } from '../../../store';
// import rawApp from '../../../store/app/app.raw.ts';
import rawChats from '../../../store/chats/chats.raw.ts';
import { useNavigate } from 'react-router-dom';

export const useSharedWorker = () => {
    const { setSocketId, updateOnline, setIsListening, updateReadChat, createMessage, removeChat } = useAppAction();
    const setToBegin = useUpdateChat();
    const navigate = useNavigate();

    useEffect(() => {
        if (!navigator.serviceWorker) {
            console.log('Service Workers не поддерживаются');
            return;
        }

        navigator.serviceWorker.register('/worker.js');

        navigator.serviceWorker.ready.then(() => {
            navigator.serviceWorker.controller?.postMessage({
                event: 'CONNECT',
                payload: Envs.notificationsServiceUrl,
            });

            // Обработка сообщений от SharedWorker
            const audioSupport: any = document.getElementById('myAudio');
            navigator.serviceWorker.addEventListener('message', (ev: MessageEvent) => {
                const { event, data } = ev.data;

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
                        });
                        navigate(`/${data.data.id}`);
                        break;
                    case EventsEnum.CREATE_MESSAGE:
                        if (!data.success) break;

                        audioSupport.pause();
                        audioSupport.currentTime = 0;
                        audioSupport.play();

                        createMessage(data.data);
                        if (rawChats.chats.get(data.data.chatId)) setToBegin(rawChats.chats.get(data.data.chatId)!);

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
                        setIsListening(true);
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
            });
        });

        return () => {
            navigator.serviceWorker.controller?.postMessage({ event: 'DISCONNECT' });
        };
    }, []);
};
