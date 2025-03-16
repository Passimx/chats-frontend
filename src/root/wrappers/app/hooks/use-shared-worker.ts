import { useUpdateChat } from '../../../store/app/hooks/use-update-chat.hook.ts';
import { useNavigate } from 'react-router-dom';
import { useAppAction } from '../../../store';
import { DataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import rawChats from '../../../store/chats/chats.raw.ts';
import { useCallback, useEffect } from 'react';

export const useNotificationAction = () => {
    const { setSocketId, updateOnline, setIsListening, updateReadChat, createMessage, removeChat } = useAppAction();
    const setToBegin = useUpdateChat();
    const navigate = useNavigate();
    const audioSupport: any = document.getElementById('myAudio');

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

// const BC_CHANNEL = new BroadcastChannel('chat_channel');
// const SOCKET_INTERVAL_CONNECTION = 1000;
// const SOCKET: WebSocket | null = null;

export const useSharedWorker = () => {
    const sendMessage = useNotificationAction();

    const runConnection = useCallback(() => {
        // if (SOCKET) return;
        // SOCKET = new WebSocket(Envs.notificationsServiceUrl);
        //
        // SOCKET.addEventListener('message', (event) => {
        //     const data = JSON.parse(event.data);
        //     sendMessage({ ...data, payload: data.data });
        // });
        //
        // SOCKET.addEventListener('close', () => {
        //     SOCKET?.close();
        //     SOCKET = null;
        //         sendMessage({ event: EventsEnum.CLOSE_SOCKET });
        //         sendMessage({ event: EventsEnum.ERROR, data: 'Cannot connect to notifications service.' });
        //         runConnection();
        //         // BC_CHANNEL.postMessage({ type: 'NEW_MESSAGE', data }); // 🔥 Рассылаем другим вкладкам
        // });
        //
        // setTimeout(runConnection, SOCKET_INTERVAL_CONNECTION);
    }, []);

    useEffect(() => {
        runConnection();

        if (!navigator.serviceWorker) {
            console.log('Service Workers не поддерживаются');
            return;
        }

        navigator.serviceWorker.ready.then(() => {
            navigator.serviceWorker.controller?.postMessage({
                event: 'CONNECT',
                payload: Envs.notificationsServiceUrl,
            });

            navigator.serviceWorker.addEventListener('message', (ev: MessageEvent<DataType>) => {
                sendMessage(ev.data);
            });
        });
    }, []);

    // useEffect(() => {
    //     BC_CHANNEL.onmessage = (event) => {
    //         if (event.data.type === 'NEW_MESSAGE') {
    //             sendMessage(event.data); // Сообщение приходит в не-основные вкладки
    //         }
    //     };
    // }, []);
};

// const sendMessage = useNotificationAction();
// const BC_CHANNEL = new BroadcastChannel('chat_channel');
// const MAIN_TAB_KEY = 'main_tab';
// const LAST_ACTIVE_KEY = 'main_tab_last_active';
// BC_CHANNEL.onmessage = sendMessage;
//
// const checkMainTab = () => {
//     const mainTabId = localStorage.getItem(MAIN_TAB_KEY);
//     const lastActive = Number(localStorage.getItem(LAST_ACTIVE_KEY)) || 0;
//     const now = Date.now();
//
//     if (!mainTabId || now - lastActive > 7000) {
//         localStorage.setItem(MAIN_TAB_KEY, String(now));
//         localStorage.setItem(LAST_ACTIVE_KEY, String(now));
//         setIsMainTab(true);
//     } else {
//         setIsMainTab(false);
//     }
// };
//
// useEffect(() => {
//     const socket = new WebSocket(Envs.notificationsServiceUrl);
//
//     socket.addEventListener('message', (event) => {
//         const data = JSON.parse(event.data);
//         BC_CHANNEL.postMessage(data);
//         // sendMessage({ data: data });
//     });
//
//     // socket.addEventListener('close', () => {
//     //     sendMessage({ data: { event: EventsEnum.CLOSE_SOCKET } });
//     //     sendMessage({ data: { event: EventsEnum.ERROR, data: 'Cannot connect to notifications service.' } });
//     // });
// }, []);
// export const useSharedWorker = () => {
//     const { setSocketId, updateOnline, setIsListening, updateReadChat, createMessage, removeChat } = useAppAction();
//     const setToBegin = useUpdateChat();
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         if (!navigator.serviceWorker) {
//             console.log('Service Workers не поддерживаются');
//             return;
//         }
//
//
//         navigator.serviceWorker.ready.then(() => {
//             navigator.serviceWorker.controller?.postMessage({
//                 event: 'CONNECT',
//                 payload: Envs.notificationsServiceUrl,
//             });
//
//             // Обработка сообщений от SharedWorker
//             const audioSupport: any = document.getElementById('myAudio');
//             navigator.serviceWorker.addEventListener('message', (ev: MessageEvent) => {
//                 const { event, data } = ev.data;
//
//                 switch (event) {
//                     case EventsEnum.GET_SOCKET_ID:
//                         setSocketId(data);
//                         Envs.socketId = data;
//                         break;
//                     case EventsEnum.ADD_CHAT:
//                         setToBegin(data);
//                         break;
//                     case EventsEnum.CREATE_CHAT:
//                         if (!data.success) break;
//                         setToBegin({
//                             ...data.data,
//                             messages: [data.data.message],
//                             readMessage: 1,
//                         });
//                         navigate(`/${data.data.id}`);
//                         break;
//                     case EventsEnum.CREATE_MESSAGE:
//                         if (!data.success) break;
//
//                         audioSupport.pause();
//                         audioSupport.currentTime = 0;
//                         audioSupport.play();
//
//                         createMessage(data.data);
//                         if (rawChats.chats.get(data.data.chatId)) setToBegin(rawChats.chats.get(data.data.chatId)!);
//
//                         break;
//                     case EventsEnum.READ_MESSAGE:
//                         updateReadChat(data);
//                         break;
//                     case EventsEnum.REMOVE_CHAT:
//                         removeChat(data);
//                         break;
//                     //     case EventsEnum.UPDATE_BADGE:
//                     //         if (navigator.setAppBadge) navigator.setAppBadge(data);
//                     //         break;
//                     case EventsEnum.UPDATE_CHAT_ONLINE:
//                         if (!data.success) break;
//                         updateOnline(data.data);
//                         setIsListening(true);
//                         break;
//                     case EventsEnum.CLOSE_SOCKET:
//                         setSocketId(undefined);
//                         setIsListening(false);
//                         break;
//                     case EventsEnum.ERROR:
//                         console.log(`${'\x1B[31m'}error: ${data}${'\x1B[31m'}`);
//                         break;
//                     default:
//                         break;
//                 }
//             });
//         });
//
//         return () => {
//             navigator.serviceWorker.controller?.postMessage({ event: 'DISCONNECT' });
//         };
//     }, []);
// };
