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
    transport: any;
    setTransport: any;
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
    transport: null,
    setTransport: null,
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
    const [transport, setTransport] = useState<Transport<AppData> | null>(null);
    const [device, setDevice] = useState<mediasoupClient.Device | null>(null);
    const userId = useAppSelector((state) => state.user.id);
    const [isDevice, setIsDevice] = useState<boolean>(false);

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

    const createTransport = useCallback(async (): Promise<Transport<AppData> | null> => {
        if (!roomId || !device) return null;

        try {
            const transportConfig = await fetchJson(`https://passimx.ru/api/media/transport/${roomId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peerId: userId, direction: 'send' }),
            });

            if (!transportConfig.success) return null;

            const transport = device.createSendTransport(transportConfig.data);
            setTransport(transport);
            return transport;
        } catch (error) {
            logError('Создание транспорта', error);
            return null;
        }
    }, [roomId, userId, isDevice]);

    const setupTransportEvents = useCallback(
        (transport: Transport<AppData>) => {
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
        [userId, roomId],
    );

    useEffect(() => {
        if (!routerRtpCapabilities || !roomId) return;

        initDevice().then(async () => {
            const transport = await createTransport();
            if (transport) {
                setupTransportEvents(transport);
            }
        });
    }, [routerRtpCapabilities, roomId, initDevice, createTransport, setupTransportEvents]);

    /*

    const connection = async () => {
        if (!routerRtpCapabilities || !roomId) return;

        const device = new mediasoupClient.Device();
        try {
            await device.load({ routerRtpCapabilities: routerRtpCapabilities.data.routerRtpCapabilities });
        } catch (err: unknown) {
            const error = err as Error;
            console.log(`Error download device: ${error.message}`);
        }

        const transportConfig = await fetch(`https://passimx.ru/api/media/transport/${roomId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                peerId: userId,
                direction: 'send',
            }),
        })
            .then((response) => response.json())
            .then((data) => data);
        if (!transportConfig.success) return;

        let transport: Transport<AppData> | null | undefined;
        try {
            transport = device?.createSendTransport(transportConfig.data);
        } catch (err: unknown) {
            const e = err as Error;
            console.log('error creating transport', e.message);
        }
        if (!transport || !routerRtpCapabilities) return;
        setTransport(transport);

        transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            try {
                fetch(`https://passimx.ru/api/media/transport/${transport.id}/connect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dtlsParameters: dtlsParameters,
                    }),
                }).then((response) => {
                    if (!response.ok) throw new Error('Error connection transport');
                    callback();
                });
            } catch (err: unknown) {
                const error = err as Error;
                console.log(`Ошибка соединения: ${error.message}`);
                errback(error);
            }
        });

        transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
            try {
                fetch('https://passimx.ru/api/media/producer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        transportId: transport.id,
                        kind,
                        rtpParameters,
                        roomId,
                        peerId: userId,
                    }),
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        callback(data);
                    })
                    .catch((err) => console.log('error: ', err));
            } catch (err: unknown) {
                const error = err as Error;
                console.log(`Ошибка создания продюсера: ${error.message}`);
                errback(error);
            }
        });
    };

    useEffect(() => {
        if (!routerRtpCapabilities) {
            console.log('routerRtpCapabilities not available');
            return;
        }
        connection();
    }, [routerRtpCapabilities]);

     */

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
                transport,
                setTransport,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};

/*



    const createTransport = async () => {
        if (!roomId) return;

        const params = await fetch(`https://passimx.ru/api/media/transport/${roomId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                peerId: userId,
                direction: 'send',
            }),
        })
            .then((response) => response.json())
            .then((data) => data);

        const transport = device && device?.createSendTransport(params);
        if (transport) setTransport(transport);
        console.log('transport', transport);
    };

    const createConnect = async (transport: Transport<AppData> | undefined) => {
        if (!transport) return;

        transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            fetch('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dtlsParameters: dtlsParameters,
                }),
            })
                .then(callback)
                .catch(errback);
        });
    };


 */
