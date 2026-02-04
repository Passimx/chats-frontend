import { createContext, ReactNode, useState, useRef } from 'react';
import { Device } from 'mediasoup-client';
import { useAppSelector } from '../../store';
import {
    createRoom,
    createTransport,
    connectTransport,
    createProducer,
    getRoomProducers,
    createConsumer,
} from '../../api/calls';

// Типы
type RtpCapabilities = any;
type Transport = any;
type Consumer = any;

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
    routerRtpCapabilities: RtpCapabilities | null;
    setRouterRtpCapabilities: (data: RtpCapabilities) => void;
    localStream: MediaStream | null;
    setLocalStream: (stream: MediaStream | null) => void;
};

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
    localStream: null,
    setLocalStream: () => {},
});

export const CallProvider = ({ children }: { children: ReactNode }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(crypto.randomUUID());
    const [routerRtpCapabilities, setRouterRtpCapabilities] = useState<RtpCapabilities | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const userId = useAppSelector((state) => state.user.id);

    // Refs для хранения объектов mediasoup
    const deviceRef = useRef<Device | null>(null);
    const sendTransportRef = useRef<Transport | null>(null);
    const recvTransportRef = useRef<Transport | null>(null);
    const consumersRef = useRef<Map<string, Consumer>>(new Map());

    // Создание WebRTC-соединения
    const createConnection = async () => {
        if (!roomId || !userId) {
            console.error('Missing required parameters: roomId or userId');
            return;
        }

        try {
            // 1. Создаем комнату (эндпоинт 1/5)
            const roomResponse = await createRoom(roomId, userId);
            if (!roomResponse.success) {
                console.error('Failed to create room:', roomResponse.data);
                return;
            }

            // 2. Инициализируем Device (обязательно для WebRTC)
            if (!deviceRef.current) {
                deviceRef.current = new Device();
            }
            await deviceRef.current.load({ routerRtpCapabilities: roomResponse.data.routerRtpCapabilities });
            setRouterRtpCapabilities(roomResponse.data.routerRtpCapabilities);

            // 3. Создаем send transport (эндпоинт 2/5)
            const sendTransportResponse = await createTransport(roomId, userId, 'send');
            if (!sendTransportResponse.success) {
                console.error('Failed to create send transport:', sendTransportResponse.data);
                return;
            }

            // Создаем WebRTC транспорт на клиенте (обязательно для отправки медиа)
            const sendTransport = deviceRef.current.createSendTransport(sendTransportResponse.data);
            sendTransportRef.current = sendTransport;

            // Настраиваем обработчики: connect (эндпоинт 3/5) и produce (эндпоинт 4/5)
            setupSendTransportHandlers(sendTransport, roomId, userId);

            // Получаем медиа-треки и публикуем их (автоматически вызывает событие 'produce')
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            setLocalStream(stream);
            setIsMicrophoneOn(true);
            setIsCameraOn(true);

            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                await sendTransport.produce({ track: audioTrack });
            }
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                await sendTransport.produce({ track: videoTrack });
            }

            // 4. Создаем recv transport (эндпоинт 2/5, но для приема)
            const recvTransportResponse = await createTransport(roomId, userId, 'recv');
            if (!recvTransportResponse.success) {
                console.error('Failed to create recv transport:', recvTransportResponse.data);
                return;
            }

            // Создаем WebRTC транспорт на клиенте (обязательно для приема медиа)
            const recvTransport = deviceRef.current.createRecvTransport(recvTransportResponse.data);
            recvTransportRef.current = recvTransport;

            // Настраиваем обработчик connect (эндпоинт 3/5)
            setupRecvTransportHandlers(recvTransport, roomId, userId);

            // 5. Получаем producers и создаем consumers (эндпоинт 5/5)
            const producersResponse = await getRoomProducers(roomId, userId);
            if (producersResponse.success) {
                for (const producer of producersResponse.data.producers) {
                    const consumerResponse = await createConsumer(
                        roomId,
                        userId,
                        recvTransport.id,
                        producer.producerId,
                        deviceRef.current.rtpCapabilities,
                    );

                    if (consumerResponse.success) {
                        const consumer = await recvTransport.consume({
                            id: consumerResponse.data.id,
                            producerId: consumerResponse.data.producerId,
                            kind: consumerResponse.data.kind as 'audio' | 'video',
                            rtpParameters: consumerResponse.data.rtpParameters,
                        });
                        consumersRef.current.set(producer.producerId, consumer);
                        console.log('Consumer created:', consumer.id, 'kind:', consumer.kind);
                    }
                }
            }

            setIsCallActive(true);
            console.log('Connection established successfully');
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    // Настройка обработчиков для send transport
    // Эти обработчики ОБЯЗАТЕЛЬНЫ - они вызывают эндпоинты при событиях WebRTC
    const setupSendTransportHandlers = (transport: any, roomIdParam: string, userIdParam: string) => {
        // Эндпоинт 3/5: Подключение транспорта (вызывается автоматически при первом использовании)
        transport.on('connect', async ({ dtlsParameters }: any, callback: any, errback: any) => {
            const response = await connectTransport(transport.id, dtlsParameters);
            response.success ? callback() : errback(new Error(response.data));
        });

        // Эндпоинт 4/5: Создание producer (вызывается автоматически при transport.produce())
        // rtpParameters генерируются автоматически mediasoup-client
        transport.on('produce', async ({ kind, rtpParameters }: any, callback: any, errback: any) => {
            const response = await createProducer(roomIdParam, userIdParam, transport.id, kind, rtpParameters);
            response.success ? callback({ id: response.data.producerId }) : errback(new Error(response.data));
        });

        transport.on('connectionstatechange', (state: string) => {
            if (state === 'failed' || state === 'closed') setIsCallActive(false);
        });
    };

    // Настройка обработчиков для recv transport
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setupRecvTransportHandlers = (transport: any, _roomId: string, _userId: string) => {
        // Эндпоинт 3/5: Подключение транспорта (вызывается автоматически при первом использовании)
        transport.on('connect', async ({ dtlsParameters }: any, callback: any, errback: any) => {
            const response = await connectTransport(transport.id, dtlsParameters);
            response.success ? callback() : errback(new Error(response.data));
        });
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
