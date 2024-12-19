import { useEffect } from 'react';
import { EventDataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { useUpdateChat } from '../../../store/app/hooks/use-update-chat.hook.ts';
import { useAppAction } from '../../../store';
import rawApp from '../../../store/app/app.raw.ts';

export const useSharedWorker = () => {
    const { setSocketId, setIsListening, updateReadChat } = useAppAction();
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
                case EventsEnum.CREATE_CHAT:
                    if (!data.success) break;
                    setToBegin(data.data);
                    updateReadChat({ chatId: data.data.id, number: 1 });
                    break;
                case EventsEnum.CREATE_MESSAGE:
                    if (!data.success) break;
                    setToBegin({ ...data.data.chat, messages: [data.data] });

                    audioSupport.pause();
                    audioSupport.currentTime = 0;
                    audioSupport.play();
                    break;
                case EventsEnum.READ_MESSAGE:
                    updateReadChat(data);
                    break;
                case EventsEnum.CLOSE_SOCKET:
                    setSocketId(undefined);
                    setIsListening(false);
                    break;
                case EventsEnum.ERROR:
                    console.log(`${'\x1B[31m'}error: ${data}${'\x1B[31m'}`);
                    break;
                default:
                    alert(123);
                    break;
            }
        };

        return () => sharedWorker.port.close();
    }, []);
};
