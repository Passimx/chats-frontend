import { useEffect } from 'react';
import { EventDataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { useUpdateChat } from '../../../store/app/hooks/use-update-chat.hook.ts';
import { useAppAction } from '../../../store';
import rawApp from '../../../store/app/app.raw.ts';
import rawChats from '../../../store/chats/chats.raw.ts';

export const useSharedWorker = () => {
    const { setSocketId, setIsListening, updateReadChat, setChatOnPage, removeChat } = useAppAction();
    const setToBegin = useUpdateChat();

    useEffect(() => {
        const sharedWorker = new SharedWorker('worker.js');
        sharedWorker.port.start();

        rawApp.port = sharedWorker.port;

        // Обработка сообщений от SharedWorker
        sharedWorker.port.onmessage = ({ data: { event, data } }: EventDataType) => {
            const audioSupport: any = document.getElementById('myAudio');

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
                    setToBegin({ ...data.data, messages: [data.data.message], readMessage: 1 });
                    break;
                case EventsEnum.CREATE_MESSAGE:
                    // todo
                    // уменьшить код
                    if (!data.success) break;

                    setChatOnPage({ ...data.data.chat, message: data.data });

                    if (!rawChats.chats.get(data.data.chat.id)) break;

                    if (data.data.number === rawChats.chats.get(data.data.chat.id)!.messages[0].number + 1)
                        setToBegin({
                            ...data.data.chat,
                            countMessages: data.data.number,
                            message: data.data,
                            messages: [
                                data.data,
                                ...rawChats.chats.get(data.data.chat.id)!.messages.slice(0, Envs.messages.limit - 1),
                            ],
                            readMessage: rawChats.chats.get(data.data.chat.id)!.readMessage,
                        });
                    else
                        setToBegin({
                            ...data.data.chat,
                            countMessages: data.data.number,
                            message: data.data,
                            messages: [
                                ...rawChats.chats.get(data.data.chat.id)!.messages.slice(0, Envs.messages.limit - 1),
                            ],
                            readMessage: rawChats.chats.get(data.data.chat.id)!.readMessage,
                        });

                    audioSupport.pause();
                    audioSupport.currentTime = 0;
                    audioSupport.play();
                    break;
                case EventsEnum.READ_MESSAGE:
                    updateReadChat(data);
                    break;
                case EventsEnum.REMOVE_CHAT:
                    removeChat(data);
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

        return () => sharedWorker.port.close();
    }, []);
};
