import { createContext, ReactNode, useState } from 'react';
//import { Device } from 'mediasoup-client';
import { v4 as uuidV4 } from 'uuid';

export type CallContextType = {
    createConnection: () => Promise<void>;
    isMicrophoneOn: boolean;
    setIsMicrophoneOn: (value: boolean) => void;
    isCameraOn: boolean;
    setIsCameraOn: (value: boolean) => void;
    isCallActive: boolean;
    setIsCallActive: (value: boolean) => void;
    roomId: string | null;
    setRoomId: (data: string) => void;
    routerRtpCapabilities: any | null;
    setRouterRtpCapabilities: (data: any) => void;
    localStream: boolean;
    setLocalStream: (data: boolean) => void;
};

//const device: Device = new Device();

export const CallContext = createContext<CallContextType>({
    createConnection: async () => {},
    isMicrophoneOn: false,
    isCameraOn: false,
    isCallActive: false,
    setIsMicrophoneOn: () => {},
    setIsCameraOn: () => {},
    setIsCallActive: () => {},
    roomId: '',
    setRoomId: () => {},
    routerRtpCapabilities: null,
    setRouterRtpCapabilities: () => {},
    localStream: false,
    setLocalStream: () => {},
});

//const myId = '1a197adac4c260a09a1151706dd2f0abaf1b87a8264fd05f29d0f76723de0eb8';

export const CallProvider = ({ children }: { children: ReactNode }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(uuidV4());
    const [routerRtpCapabilities, setRouterRtpCapabilities] = useState();
    const [localStream, setLocalStream] = useState(false);

    // Создание WebRTC-соединения
    const createConnection = async () => {
        /*
        try {
            // 1. Загружаем RTP-возможности в устройство
            if (routerRtpCapabilities) {
                await device.load({ routerRtpCapabilities });
            }

            // 2. Получаем параметры транспорта от сервера
            const transportParams = await createTransport(roomId!);

            // 3. Создаём транспорт через mediasoup-client
            const sendTransport = device.createSendTransport(transportParams);

            // 4. Настраиваем обработчики событий
            setupTransportHandlers(sendTransport);

            // 5. Подключаем транспорт (отправляем DTLS параметры на сервер)
            await sendTransport.connect({ dtlsParameters: transportParams.dtlsParameters });

            // 6. Публикуем локальные медиа
            await produceLocalMedia(sendTransport);
        } catch (error) {
            console.error('Connection failed:', error);
        }

     */
    };

    return (
        <CallContext.Provider
            value={{
                createConnection,
                isMicrophoneOn,
                isCameraOn,
                isCallActive,
                setIsMicrophoneOn,
                setIsCameraOn,
                setIsCallActive,
                roomId,
                setRoomId,
                routerRtpCapabilities,
                setRouterRtpCapabilities,
                localStream,
                setLocalStream,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};
/*
async function createTransport(roomId: string) {
    const myId = 'http://localhost:3006/1a197adac4c260a09a1151706dd2f0abaf1b87a8264fd05f29d0f76723de0eb8';

    return await fetch(`https://passimx.ru/api/media/transport/${roomId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            peerId: myId,
            direction: 'send', // или 'sendonly'/'recvonly'
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
}

function joinRoom(transportParams: any) {
    fetch(`https://passimx.ru/api/media/transport/${transportParams.id}/connect`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dtlsParameters: transportParams.dtlsParameters,
        }),
    });
}

function setupTransportHandlers(transport: any) {
    // Событие: требуется установить DTLS-соединение
    transport.on('connect', async ({ dtlsParameters }: { dtlsParameters: any }, callback: any, errback: any) => {
        try {
            // Отправляем DTLS параметры на сервер
            await joinRoom(transport);
            callback(); // Подтверждаем успешное подключение
        } catch (error) {
            errback(error);
        }
    });

    // Событие: нужно создать producer (отправить медиа)
    transport.on('produce', async (params: any, callback: any, errback: any) => {
        try {
            const { kind, rtpParameters } = params;
            // Отправляем запрос на сервер для создания producer
            const response = await fetch('/api/produce', {
                method: 'POST',
                body: JSON.stringify({
                    transportId: transport.id,
                    kind,
                    rtpParameters,
                }),
            });
            const { producerId } = await response.json();
            callback({ producerId });
        } catch (error) {
            errback(error);
        }
    });

    // Обработка ошибок транспорта
    transport.on('connectionstatechange', (state: any) => {
        console.log('Transport state:', state);
        if (state === 'failed' || state === 'closed') {
            console.error('Transport disconnected');
        }
    });
}

 */
