import { FC, useState, useContext, useEffect, useRef } from 'react';
import styles from './index.module.css';
import { Avatar } from '../avatar';
import { ChatEnum } from '../../root/types/chat/chat.enum';
import { useAppAction, useAppSelector } from '../../root/store';
import { CallContext } from '../../root/contexts/call';
import { VideoPlayer } from './view/video-player/video-player.tsx';
import ViewMode from './view/view-mode/view-mode.tsx';
import CallControls from './view/call-controls/CallControls.tsx';
import { getRoomProducers } from '../../root/api/calls';

const CallModal: FC = () => {
    const [isFullScreenActive, setIsFullScreenActive] = useState<boolean>(false);
    const [isMinimize, setMinimize] = useState(false);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const userId = useAppSelector((state) => state.user.id);
    const { setStateApp } = useAppAction();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    localStreamRef.current = localStream;
    const publishedForTransportIdRef = useRef<string | null>(null);

    const {
        isMicrophoneOn,
        setIsMicrophoneOn,
        sendTransport,
        recvTransport,
        roomId,
        remoteStreams,
        consumeProducer,
    } = useContext(CallContext);

    const fetchedExistingProducersForRef = useRef<string | null>(null);

    // Публикация своего видео (один раз на транспорт)
    const publishMedia = async () => {
        if (!sendTransport) return;
        if (publishedForTransportIdRef.current === sendTransport.id) return;
        publishedForTransportIdRef.current = sendTransport.id;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            // Создаем audio producer
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                try {
                    await sendTransport.produce({ track: audioTrack });
                } catch (produceError) {
                    console.error('[CallModal] Error creating audio producer:', produceError);
                    throw produceError;
                }
            }

            // Создаем video producer
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                await sendTransport.produce({
                    track: videoTrack,
                    encodings: [{ maxBitrate: 300000 }],
                });
            }
        } catch (err: unknown) {
            publishedForTransportIdRef.current = null;
            console.error('[CallModal] Ошибка создания producers:', err instanceof Error ? err.message : String(err));
        }
    };

    // Получение существующих producers при входе в звонок
    const fetchExistingProducers = async () => {
        if (!roomId || !userId) return;

        try {
            const response = await getRoomProducers(roomId, userId);
            if (response.success && response.data.producers?.length) {
                for (const producer of response.data.producers) {
                    await consumeProducer(producer.producerId, producer.kind);
                }
            }
        } catch (error) {
            console.error('[CallModal] Error fetching producers:', error);
        }
    };

    // Обработка события присоединения нового участника (бэкенд шлёт по одному событию на каждый producer)
    useEffect(() => {
        const handlePeerJoined = async (event: Event) => {
            const e = event as CustomEvent<{ roomId: string; peerId: string; producerId: string; kind: string }>;
            const { roomId: eventRoomId, peerId, producerId, kind } = e.detail ?? {};
            if (!producerId || !kind) return;
            if (eventRoomId !== roomId || peerId === userId) return;
            if (!recvTransport) return;

            try {
                await consumeProducer(producerId, kind);
            } catch (error) {
                console.error('[CallModal] Error consuming new peer producer:', error);
            }
        };

        const handlePeerLeft = () => {};

        const handleCallEnded = () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
            setLocalStream(null);
        };

        window.addEventListener('call:peer-joined', handlePeerJoined as EventListener);
        window.addEventListener('call:peer-left', handlePeerLeft as EventListener);
        window.addEventListener('call:ended', handleCallEnded);

        return () => {
            window.removeEventListener('call:peer-joined', handlePeerJoined as EventListener);
            window.removeEventListener('call:peer-left', handlePeerLeft as EventListener);
            window.removeEventListener('call:ended', handleCallEnded);
        };
    }, [roomId, userId, consumeProducer, recvTransport, localStream]);

    // Публикация медиа при появлении sendTransport (задержка чтобы при Strict Mode/HMR первый unmount отменил вызов, и выполнился только у реального mount)
    useEffect(() => {
        if (!sendTransport || localStream) return;
        const t = setTimeout(() => {
            publishMedia();
        }, 150);
        return () => clearTimeout(t);
    }, [sendTransport, localStream]);

    // Подписка на существующих producers только когда готов recvTransport
    useEffect(() => {
        if (!recvTransport || !roomId || !userId) return;
        if (fetchedExistingProducersForRef.current === roomId) return;
        fetchedExistingProducersForRef.current = roomId;
        fetchExistingProducers();
    }, [recvTransport, roomId, userId]);

    // Cleanup при размонтировании
    useEffect(() => {
        return () => {
            const stream = localStreamRef.current;
            if (stream) stream.getTracks().forEach((t) => t.stop());
        };
    }, []);

    return (
        <div
            className={styles.background}
            data-fullscreen={(isFullScreenActive && 'active') || ''}
            data-minimize={(isMinimize && 'active') || ''}
        >
            <ViewMode
                isFullScreenActive={isFullScreenActive}
                setIsFullScreenActive={setIsFullScreenActive}
                isMinimize={isMinimize}
                setMinimize={setMinimize}
                isMicrophoneOn={isMicrophoneOn}
                setIsMicrophoneOn={setIsMicrophoneOn}
                setStateApp={setStateApp}
            />

            {/* Локальное видео */}
            {localStream && <VideoPlayer srcObject={localStream} autoPlay muted />}

            {/* Удаленные видео */}
            {Array.from(remoteStreams.entries()).map(([producerId, stream]) => (
                <VideoPlayer key={producerId} srcObject={stream} autoPlay />
            ))}

            {/* Аватар если нет видео */}
            {!localStream && remoteStreams.size === 0 && (
                <div className={styles.avatar} data-minimize={(isMinimize && 'active') || ''}>
                    {chatOnPage && (
                        <Avatar
                            showIcon={[ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                            isClickable={![ChatEnum.IS_SYSTEM, ChatEnum.IS_FAVORITES].includes(chatOnPage.type)}
                        />
                    )}
                </div>
            )}

            <CallControls isMinimize={isMinimize} isFullScreenActive={isFullScreenActive} setStateApp={setStateApp} />
        </div>
    );
};

export default CallModal;
