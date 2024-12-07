import { useEffect } from 'react';
import { EventDataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { useUpdateChat } from '../../../store/app/hooks/use-update-chat.hook.ts';

export const useSharedWorker = () => {
    const setToBegin = useUpdateChat();

    useEffect(() => {
        const sharedWorker = new SharedWorker('worker.js');
        sharedWorker.port.start();

        // Обработка сообщений от SharedWorker
        sharedWorker.port.onmessage = ({ data: { event, data } }: EventDataType) => {
            const x: any = document.getElementById('myAudio');

            switch (event) {
                case EventsEnum.GET_SOCKET_ID:
                    Envs.socketId = data;
                    break;
                case EventsEnum.CREATE_CHAT:
                    if (!data.success) break;
                    setToBegin(data.data);
                    break;
                case EventsEnum.CREATE_MESSAGE:
                    if (!data.success) break;
                    setToBegin({ ...data.data.chat, messages: [data.data] });
                    x.play();
                    break;
                default:
                    break;
            }
        };

        return () => sharedWorker.port.close();
    }, []);
};
