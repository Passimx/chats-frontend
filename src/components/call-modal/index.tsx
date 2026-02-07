import { FC, useState, useContext, useEffect } from 'react';
import styles from './index.module.css';
import { Avatar } from '../avatar';
import { ChatEnum } from '../../root/types/chat/chat.enum';
import { useAppAction, useAppSelector } from '../../root/store';
import { CallContext } from '../../root/contexts/call';
import { VideoPlayer } from './view/video-player/video-player.tsx';
import ViewMode from './view/view-mode/view-mode.tsx';
import CallControls from './view/call-controls/CallControls.tsx';
import { Producer } from 'mediasoup-client/types';

const CallModal: FC = () => {
    const [isFullScreenActive, setIsFullScreenActive] = useState<boolean>(false);
    const [isMinimize, setMinimize] = useState(false);
    const { chatOnPage } = useAppSelector((state) => state.chats);
    const { setStateApp } = useAppAction();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [producer, setProducer] = useState<Producer | null>(null);

    const { isMicrophoneOn, setIsMicrophoneOn, sendTransport } = useContext(CallContext);

    const publishVideo = async () => {
        if (!sendTransport) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setStream(stream);
            const track = stream.getVideoTracks()[0];

            const producer = await sendTransport.produce({
                track,
                encodings: [{ maxBitrate: 100000 }, { maxBitrate: 300000 }],
                codecOptions: { videoGoogleStartBitrate: 100 },
            });
            console.log('test 2', producer);
            if (producer) {
                setProducer(producer);
            }
        } catch (err: unknown) {
            const error = err as Error;
            console.log(`Ошибка создания продюсера в call-modal ${error.message}`);
        }
    };

    useEffect(() => {
        if (!sendTransport) return;

        publishVideo();

        return () => {
            //if (producer) producer.close();
            //if (transport) transport.close();
        };
    }, [sendTransport, producer]);

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

            {(Boolean(stream) && <VideoPlayer srcObject={stream} autoPlay muted />) || (
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
