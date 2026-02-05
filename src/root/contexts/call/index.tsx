import { createContext, ReactNode, useState, useEffect } from 'react';
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

export const CallProvider = ({ children }: { children: ReactNode }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [routerRtpCapabilities, setRouterRtpCapabilities] = useState<any | null>(null);
    const [transport, setTransport] = useState<Transport<AppData> | null>(null);
    const userId = useAppSelector((state) => state.user.id);

    const connection = async () => {
        if (!routerRtpCapabilities || !roomId) return;

        const device = new mediasoupClient.Device();
        await device.load({ routerRtpCapabilities: routerRtpCapabilities });

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

        const transport = device?.createSendTransport(transportConfig.data);
        if (transport) setTransport(transport);

        transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            try {
                fetch(`https://passimx.ru/api/media/transport/${transport.id}/connect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dtlsParameters: dtlsParameters,
                    }),
                }).then(callback);
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
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('data', data);
                        callback(data);
                    });
            } catch (err: unknown) {
                const error = err as Error;
                console.log(`Ошибка создания продюсера: ${error.message}`);
                errback(error);
            }
        });
    };

    useEffect(() => {
        connection();
    }, [routerRtpCapabilities]);

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

    const initDevice = async () => {
        if (!routerRtpCapabilities) return;
        try {
            const newDevice = new mediasoupClient.Device();
            if (routerRtpCapabilities) {
                await newDevice.load({ routerRtpCapabilities: routerRtpCapabilities });
                setDevice(newDevice);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.log(`Ошибка инициализации устройства: ${message}`);
        }
    };

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
