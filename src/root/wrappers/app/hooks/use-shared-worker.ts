import { useEffect } from 'react';
import { EventDataType } from '../../../types/events/event-data.type.ts';
import { EventsEnum } from '../../../types/events/events.enum.ts';
import { Envs } from '../../../../common/config/envs/envs.ts';
import { useAppAction } from '../../../store';

export const useSharedWorker = () => {
    const { addChat } = useAppAction();

    useEffect(() => {
        const sharedWorker = new SharedWorker('worker.js');
        sharedWorker.port.start();

        // Обработка сообщений от SharedWorker
        sharedWorker.port.onmessage = ({ data }: EventDataType) => {
            switch (data.event) {
                case EventsEnum.GET_SOCKET_ID:
                    Envs.socketId = data.data;
                    break;
                case EventsEnum.CREATE_CHAT:
                    if (data.data.success) addChat(data.data.data);
                    break;
                default:
                    break;
            }
        };

        return () => sharedWorker.port.close();
    }, []);
};
