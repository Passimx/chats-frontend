import { createContext, ReactNode, useState, useEffect, useCallback } from 'react';
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

const partnerId = 'ed30a4145901400c49cf343655077d78596fb5ef5dd5092ea4f982600bda2fe6';

export const CallProvider = ({ children }: { children: ReactNode }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [routerRtpCapabilities, setRouterRtpCapabilities] = useState<any | null>(null);
    const [sendTransport, setSendTransport] = useState<Transport<AppData> | null>(null);
    const [recvTransport, recvSetTransport] = useState<Transport<AppData> | null>(null);
    const [device, setDevice] = useState<mediasoupClient.Device | null>(null);
    const userId = useAppSelector((state) => state.user.id);
    const [isDevice, setIsDevice] = useState<boolean>(false);
    const [isSendTransport, setIsSendTransport] = useState(false);
    const [isRecvTransport, setIsRecvTransport] = useState(false);

    const initDevice = useCallback(async () => {
        if (!routerRtpCapabilities) return;

        try {
            const newDevice = new mediasoupClient.Device();
            await newDevice.load({ routerRtpCapabilities });
            setDevice(newDevice);
            setIsDevice(true);
        } catch (error) {
            logError('Инициализация устройства', error);
        }
    }, [routerRtpCapabilities]);

    const createSendTransport = useCallback(
        async (userId: string) => {
            if (!roomId || !device) return null;

            try {
                const transportConfig = await fetchJson(`https://passimx.ru/api/media/transport/${roomId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ peerId: userId, direction: 'send' }),
                });

                if (!transportConfig.success) return null;

                const transport = device.createSendTransport(transportConfig.data);
                setSendTransport(transport);
                setIsSendTransport(true);
                console.log('producer создан');
            } catch (error) {
                logError('Создание send транспорта', error);
                return null;
            }
        },
        [roomId, userId, isDevice, isSendTransport],
    );

    const createRecvTransport = useCallback(
        async (userId: string) => {
            if (!device) return;

            try {
                const transportConfig = await fetchJson(`https://passimx.ru/api/media/transport/${roomId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ peerId: userId, direction: 'recv' }),
                });

                if (!transportConfig.success) return null;

                const transport = device.createRecvTransport(transportConfig.data);
                recvSetTransport(transport);
                setIsRecvTransport(true);
            } catch (e: unknown) {
                logError('Создание recv транспорта', e);
                return null;
            }
        },
        [roomId, isDevice, isRecvTransport],
    );

    const setupSendTransport = useCallback(
        (transport: Transport<AppData>, userId: string) => {
            transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    await fetchJson(`https://passimx.ru/api/media/transport/${transport.id}/connect`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dtlsParameters }),
                    });
                    callback();
                } catch (err) {
                    const error = err as Error;
                    logError('Соединение транспорта', error);
                    errback(error);
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
                    callback(result);
                } catch (err) {
                    const error = err as Error;
                    logError('Создание продюсера', error);
                    errback(error);
                }
            });
        },
        [userId, roomId, isSendTransport],
    );

    const setupRecvTransport = useCallback(
        async (transport: Transport<AppData>, userId: string) => {
            if (!sendTransport || !transport) return;
            transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    console.log('consumer connect');
                    await fetchJson(`https://passimx.ru/api/media/transport/${transport.id}/connect`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dtlsParameters }),
                    });
                    callback();
                } catch (err) {
                    const error = err as Error;
                    logError('Соединение транспорта', error);
                    errback(error);
                }
            });

            let producerList: any;
            try {
                const { data } = await fetch(`https://passimx.ru/api/media/room/${roomId}/producers`)
                    .then((response) => response.json())
                    .then((data) => data)
                    .catch((e) => console.log(`error getting producers: ${e.message}`));

                producerList = data.producers;
                console.log('producers', producerList);
            } catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                console.log(`Не удалось получить список продюсеров: ${message}`);
            }

            try {
                for (const producer of producerList) {
                    await fetchJson('https://passimx.ru/api/media/consumer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            roomId,
                            peerId: userId,
                            transportId: transport.id,
                            producerId: producer.id,
                            rtpCapabilities: producer.rtpParameters,
                        }),
                    });
                }

                console.log('consumer создан');
            } catch (err) {
                const error = err as Error;
                logError('Соединение recv-транспорта', error);
            }
        },
        [userId, roomId, isRecvTransport],
    );

    useEffect(() => {
        if (!routerRtpCapabilities || !roomId || !userId) return;

        initDevice().then(async () => {
            createSendTransport(userId);
            createRecvTransport(userId);

            createSendTransport(partnerId);
            createRecvTransport(partnerId);
            if (sendTransport && recvTransport) {
                setupSendTransport(sendTransport, userId);
                setupRecvTransport(recvTransport, userId);

                setupSendTransport(sendTransport, partnerId);
                setupRecvTransport(recvTransport, partnerId);
            }
        });
    }, [
        routerRtpCapabilities,
        roomId,
        initDevice,
        createSendTransport,
        createRecvTransport,
        setupSendTransport,
        setupRecvTransport,
    ]);

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
            }}
        >
            {children}
        </CallContext.Provider>
    );
};
