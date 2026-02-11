import { createContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { useAppSelector } from '../../store';
import * as mediasoupClient from 'mediasoup-client';
import { AppData, Transport } from 'mediasoup-client/types';

export type CallContextType = {
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
    sendTransport: any;
    setSendTransport: any;
    recvTransport: any;
    recvSetTransport: any;
    device: any;
    remoteStreams: Map<string, MediaStream>;
    setRemoteStreams: (streams: Map<string, MediaStream>) => void;
    consumeProducer: (producerId: string, kind: string) => Promise<void>;
};

export const CallContext = createContext<CallContextType>({
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
    sendTransport: null,
    setSendTransport: null,
    recvTransport: null,
    recvSetTransport: null,
    device: null,
    remoteStreams: new Map(),
    setRemoteStreams: () => {},
    consumeProducer: async () => {},
});

const logError = (context: string, error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[CallProvider] ${context}: ${message}`);
};

async function fetchJson(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
}

export const CallProvider = ({ children }: { children: ReactNode }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [routerRtpCapabilities, setRouterRtpCapabilities] = useState<any | null>(null);
    const [sendTransport, setSendTransport] = useState<Transport<AppData> | null>(null);
    const [recvTransport, recvSetTransport] = useState<Transport<AppData> | null>(null);
    const [device, setDevice] = useState<mediasoupClient.Device | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
    const userId = useAppSelector((state) => state.user.id);
    const transportsCreatingRef = useRef(false);

    const initDevice = useCallback(async () => {
        if (!routerRtpCapabilities || device) return;

        try {
            const newDevice = new mediasoupClient.Device();
            await newDevice.load({ routerRtpCapabilities });
            setDevice(newDevice);
        } catch (error) {
            logError('Инициализация устройства', error);
        }
    }, [routerRtpCapabilities, device]);

    const createSendTransport = useCallback(async () => {
        if (!roomId || !device || sendTransport || !userId) return;

        try {
            const transportConfig = await fetchJson(`https://passimx.ru/api/media/transport/${roomId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peerId: userId, direction: 'send' }),
            });

            if (!transportConfig.success) return;

            const transport = device.createSendTransport(transportConfig.data);
            
            // Setup transport handlers. Connect вызывается библиотекой лениво — при первом produce().
            transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    const result = await fetchJson(`https://passimx.ru/api/media/transport/${transport.id}/connect`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dtlsParameters }),
                    });
                    if (!result.success) throw new Error(String(result.data));
                    callback();
                } catch (err) {
                    logError('Send transport connect', err);
                    errback(err as Error);
                }
            });

            transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
                try {
                    const result = await fetchJson('https://passimx.ru/api/media/producer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            transportId: transport.id,
                            kind,
                            rtpParameters,
                            roomId,
                            peerId: userId,
                        }),
                    });
                    if (!result.success) throw new Error(String(result.data));
                    const producerId = result.data?.producerId;
                    if (!producerId) throw new Error('producerId missing');
                    callback({ id: producerId });
                } catch (err) {
                    logError('Создание producer', err);
                    errback(err as Error);
                }
            });

            setSendTransport(transport);
        } catch (error) {
            logError('Создание send транспорта', error);
        }
    }, [roomId, device, userId, sendTransport]);

    const createRecvTransport = useCallback(async () => {
        if (!roomId || !device || recvTransport) return;

        try {
            const transportConfig = await fetchJson(`https://passimx.ru/api/media/transport/${roomId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peerId: userId, direction: 'recv' }),
            });

            if (!transportConfig.success) return;

            const transport = device.createRecvTransport(transportConfig.data);

            // Setup transport handlers. Connect вызывается библиотекой лениво — при первом consume().
            transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    const result = await fetchJson(`https://passimx.ru/api/media/transport/${transport.id}/connect`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dtlsParameters }),
                    });
                    if (!result.success) throw new Error(String(result.data));
                    callback();
                } catch (err) {
                    logError('Recv transport connect', err);
                    errback(err as Error);
                }
            });

            recvSetTransport(transport);
        } catch (error) {
            logError('Создание recv транспорта', error);
        }
    }, [roomId, device, userId, recvTransport]);

    // Функция для создания consumer для конкретного producer
    const consumeProducer = useCallback(
        async (producerId: string, _kind: string) => {
            if (!recvTransport || !device || !roomId) return;

            try {
                const result = await fetchJson('https://passimx.ru/api/media/consumer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roomId,
                        peerId: userId,
                        transportId: recvTransport.id,
                        producerId,
                        rtpCapabilities: device.rtpCapabilities,
                    }),
                });

                if (!result.success) return;

                const consumerData = result.data;

                // Создаем consumer на клиенте
                const consumer = await recvTransport.consume({
                    id: consumerData.id,
                    producerId: consumerData.producerId,
                    kind: consumerData.kind,
                    rtpParameters: consumerData.rtpParameters,
                });



                // Добавляем track в remoteStreams
                const stream = new MediaStream([consumer.track]);
                setRemoteStreams((prev) => {
                    const next = new Map(prev);
                    next.set(producerId, stream);
                    return next;
                });
            } catch (error) {
                logError(`Создание consumer для ${producerId}`, error);
            }
        },
        [recvTransport, device, roomId, userId],
    );

    // Инициализация при изменении routerRtpCapabilities
    useEffect(() => {
        if (routerRtpCapabilities && roomId && userId) {
            initDevice();
        }
    }, [routerRtpCapabilities, roomId, userId, initDevice]);

    // Создание транспортов один раз после инициализации device
    useEffect(() => {
        if (!device || !roomId || !userId || sendTransport || recvTransport) return;
        if (transportsCreatingRef.current) return;

        transportsCreatingRef.current = true;
        (async () => {
            try {
                await createSendTransport();
                await createRecvTransport();
            } finally {
                transportsCreatingRef.current = false;
            }
        })();
    }, [device, roomId, userId]);

    return (
        <CallContext.Provider
            value={{
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
                sendTransport,
                setSendTransport,
                recvTransport,
                recvSetTransport,
                device,
                remoteStreams,
                setRemoteStreams,
                consumeProducer,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};
