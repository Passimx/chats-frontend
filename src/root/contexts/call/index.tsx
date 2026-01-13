import { createContext, ReactNode, useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

export type CallContextType = {
    ws: any;
    peerConnection: RTCPeerConnection | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    createConnection: () => Promise<void>;
    hangUp: () => void;
    isMicrophoneOn: boolean;
    setIsMicrophoneOn: (value: boolean) => void;
    isCameraOn: boolean;
    setIsCameraOn: (value: boolean) => void;
    isCallActive: boolean;
    setIsCallActive: (value: boolean) => void;
};

const WS = 'http://localhost:5000';

export const CallContext = createContext<CallContextType>({
    ws: null,
    peerConnection: null,
    localStream: null,
    remoteStream: null,
    createConnection: async () => {},
    hangUp: () => {},
    isMicrophoneOn: false,
    isCameraOn: false,
    isCallActive: false,
    setIsMicrophoneOn: () => {},
    setIsCameraOn: () => {},
    setIsCallActive: () => {},
});

export const CallProvider = ({ children }: { children: ReactNode }) => {
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [roomId, setRoomId] = useState<any | null>(null);

    const ws = socketIOClient(WS);

    // Создание WebRTC-соединения
    const createConnection = async () => {
        try {
            // 1. Создаём PeerConnection с ICE-серверами
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });
            setPeerConnection(pc);

            // 2. Получаем доступ к камере и микрофону
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setLocalStream(stream);

            // Добавляем локальные треки в соединение
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            // 3. Создаём и отправляем SDP-offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            ws.emit('offer', {
                roomId: roomId,
                sdp: offer,
            });

            // 4. Обрабатываем ICE-кандидаты
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    ws.emit('candidate', {
                        roomId: roomId,
                        candidate: event.candidate,
                    });
                }
            };

            // 5. Обрабатываем удалённый поток
            pc.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };
        } catch (error) {
            console.error('Ошибка при создании соединения:', error);
        }
    };

    // Завершение вызова
    const hangUp = () => {
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }
        setLocalStream(null);
        setRemoteStream(null);
    };

    useEffect(() => {
        ws.on('created-room', (data: any) => {
            setRoomId(data);
        });

        // 1. Создаём своё PeerConnection
        ws.on('offer', async (data: any) => {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });
            setPeerConnection(pc);

            // 2. Получаем локальный поток
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            setLocalStream(stream);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            // 3. Устанавливаем offer как remoteDescription
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

            // 4. Создаём и отправляем answer
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws.emit('answer', {
                roomId: data.roomId,
                sdp: answer,
            });

            // 5. Обрабатываем ICE-кандидаты
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    ws.emit('candidate', {
                        roomId: data.roomId,
                        candidate: event.candidate,
                    });
                }
            };

            // 6. Получаем удалённый поток
            pc.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };
        });

        ws.on('answer', (data: any) => {
            if (peerConnection) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
            }
        });

        ws.on('candidate', (data: any) => {
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        });

        return () => {
            ws.off('created-room');
            ws.off('answer');
            ws.off('candidate');
        };
    }, []);
    return (
        <CallContext.Provider
            value={{
                ws,
                peerConnection,
                localStream,
                remoteStream,
                createConnection,
                hangUp,
                isMicrophoneOn,
                isCameraOn,
                isCallActive,
                setIsMicrophoneOn,
                setIsCameraOn,
                setIsCallActive,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};
